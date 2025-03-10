interface DataRowProps {
    label: string;
    value: string | number;
    fullWidth?: boolean;
}

export function DataRow({ label, value, fullWidth = false }: DataRowProps) {
    if (fullWidth) {
        return (
            <div className="py-1 border-b border-gray-100">
                <div className="text-gray-600">{label}</div>
                <div className="font-medium">{value}</div>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-center py-1 border-b border-gray-100">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
} 