interface VoucherHeaderProps {
    voucherNumber: string;
    isDriverVoucher?: boolean;
}

export function VoucherHeader({ voucherNumber, isDriverVoucher = false }: VoucherHeaderProps) {
    return (
        <div className="text-center mb-4 border-b pb-4 print:hidden">
            <div className="flex justify-center items-center mb-4">
                <span className="text-3xl font-bold tracking-tight">
                    <span className="text-black">Pro</span>
                    <span className="text-green-600">Transfer</span>
                </span>
            </div>
            <h1 className="text-xl font-bold text-blue-600 mb-1">
                {isDriverVoucher ? 'Şoför Voucherı' : 'Müşteri Voucherı'}
            </h1>
            <div className="text-gray-600 text-sm font-medium">
                Voucher No: {voucherNumber}
            </div>
        </div>
    );
} 