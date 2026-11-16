import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { site_id, description, amount, has_receipt, justification } = body;

    if (!has_receipt && (!justification || justification.trim().length < 5)) {
      return NextResponse.json({ error: 'تبرير المصروف الميداني إلزامي للمصروفات بدون فاتورة' }, { status: 400 });
    }

    return NextResponse.json({
      status: 'SUCCESS',
      message: 'تم تسجيل بند العهدة بنجاح وفق الضوابط',
      data: { site_id, description, amount, has_receipt, justification }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
