import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { site_id, month_year } = body;
    // Calculation mock or DB connection
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'تم حساب الرواتب بنجاح',
      site_id,
      month_year,
      total_payroll: 178000
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
