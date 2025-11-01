export function toTitleCase(text: string): string {
    // Boş veya undefined kontrolü
    if (!text) return text;

    // Her kelimenin ilk harfini büyük yap
    return text.toLowerCase().split(' ').map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

// Özel durumlar için format fonksiyonları
export function formatPassengerName(name: string): string {
    // Özel karakterleri ve fazladan boşlukları temizle
    const cleanName = name.trim().replace(/\s+/g, ' ');
    
    // İsmi parçalara ayır
    const nameParts = cleanName.split(' ');
    
    // Her bir parçayı formatla
    const formattedParts = nameParts.map(part => {
        // Eğer parça içinde özel karakterler varsa (ğ, ş, ı, vb.)
        const specialChars: { [key: string]: string } = {
            'i': 'İ',
            'ı': 'I',
            'ğ': 'Ğ',
            'ü': 'Ü',
            'ş': 'Ş',
            'ö': 'Ö',
            'ç': 'Ç'
        };

        // Parçanın ilk harfini kontrol et
        const firstChar = part.charAt(0).toLowerCase();
        const restOfWord = part.slice(1).toLowerCase();

        // Eğer ilk harf özel bir karakterse, onun büyük halini kullan
        const upperFirstChar = specialChars[firstChar] || part.charAt(0).toUpperCase();

        return upperFirstChar + restOfWord;
    });

    return formattedParts.join(' ');
}

export function formatLocation(location: string): string {
    // Havalimanı kodları için özel durum (IST, SAW gibi)
    if (location.toUpperCase().includes('IST') || location.toUpperCase().includes('SAW')) {
        // Havalimanı kodlarını tamamen büyük harf yap
        return location.split(' ').map(word => {
            if (word.toUpperCase().includes('IST') || word.toUpperCase().includes('SAW')) {
                return word.toUpperCase();
            }
            return toTitleCase(word);
        }).join(' ');
    }
    return toTitleCase(location);
}

export function formatHotelName(hotelName: string): string {
    // Otel isimlerinde "ve", "by", "the" gibi bağlaçları küçük harf yap
    const lowerCaseWords = ['ve', 'by', 'the', 'and', 'of', 'in', 'at', 'on'];
    
    return hotelName.toLowerCase().split(' ').map((word, index) => {
        if (index > 0 && lowerCaseWords.includes(word.toLowerCase())) {
            return word.toLowerCase();
        }
        return toTitleCase(word);
    }).join(' ');
} 