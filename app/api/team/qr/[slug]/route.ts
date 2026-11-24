import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

interface Props {
  params: { slug: string };
}

export async function GET(req: Request, { params }: Props) {
  const slug = params.slug;
  const { searchParams } = new URL(req.url);
  const download = searchParams.get('download') === '1';

  // Always point to the production public URL for the specific member
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const baseUrl = (rawUrl && !rawUrl.includes('localhost')
    ? rawUrl
    : 'https://www.dreamcybersecurity.pk'
  ).replace(/\/+$/, '');

  const memberUrl = `${baseUrl}/team/${slug}`;

  try {
    const pngBuffer = await QRCode.toBuffer(memberUrl, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'L',
    });

    const headers: Record<string, string> = {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    };

    if (download) {
      headers['Content-Disposition'] = `attachment; filename="qr-${slug}.png"`;
    }

    return new NextResponse(pngBuffer as unknown as BodyInit, { status: 200, headers });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
