import { NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backend';

const HOP_BY_HEADER = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'host',
  'content-length',
]);

function buildTargetUrl(req, segments) {
  const base = getBackendUrl();
  const path = segments.join('/');
  const target = new URL(`${base}/api/${path}`);
  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });
  return target.toString();
}

async function proxy(req, segments) {
  const targetUrl = buildTargetUrl(req, segments);
  const headers = new Headers();

  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HEADER.has(lower)) return;
    if (lower.startsWith('x-forwarded')) return;
    headers.set(key, value);
  });

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
  }

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
  });

  const text = await upstream.text();
  const ct = upstream.headers.get('content-type') || 'application/json';
  return new NextResponse(text, {
    status: upstream.status,
    headers: { 'content-type': ct },
  });
}

export async function GET(req, ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req, ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PUT(req, ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PATCH(req, ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function DELETE(req, ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
