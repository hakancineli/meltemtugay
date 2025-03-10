'use client';

interface PrintButtonProps {
    voucherType?: 'customer' | 'driver';
}

export default function PrintButton({ voucherType = 'customer' }: PrintButtonProps) {
    return (
        <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
            Yazdır
        </button>
    );
} 