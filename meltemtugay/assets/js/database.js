// Veritabanı bağlantısı ve CRUD işlemleri
class DatabaseService {
    constructor() {
        // Proje spesifik veritabanı bağlantı bilgileri
        this.projectName = "meltemtugay";
        this.dbUrl = "postgres://19293fc73229a1df27a5879186c4fc5dc31af97ad1a554345750868344a03a10:sk_WETZMQEwkma9BWLXkA3Dk@db.prisma.io:5432/postgres?sslmode=require";
        this.prismaUrl = "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19XRVRaTVFFd2ttYTlCV0xYa0EzRGsiLCJhcGlfa2V5IjoiMDFLODlEWTNZQ0pQUFYzREdBNTVUNzVZREUiLCJ0ZW5hbnRfaWQiOiIxOTI5M2ZjNzMyMjlhMWRmMjdhNTg3OTE4NmM0ZmM1ZGMzMWFmOTdhZDFhNTU0MzQ1NzUwODY4MzQ0YTAzYTEwIiwiaW50ZXJuYWxfc2VjcmV0IjoiNGExMmFkMzQtNmZkZS00NjhkLWFlYmItNmVhNTZhNTIxYzg5In0.qgEK1zWVoU1x1cNu8ARuu0Q0--nf9R3YPb4LdjqbbKo";
        
        // Vercel'de çalışırken API endpoint kullanacağız
        this.apiEndpoint = "/api";
        
        // Başlangıçta localStorage kullanıyoruz (fallback)
        this.useLocalStorage = true;
        
        // Proje spesifik localStorage anahtarları
        this.storageKeys = {
            appointments: `${this.projectName}_appointments`,
            pageContents: `${this.projectName}_pageContents`
        };
    }
    
    // Randevu ekleme
    async addAppointment(appointmentData) {
        try {
            if (this.useLocalStorage) {
                // localStorage kullanarak randevu ekle
                let appointments = JSON.parse(localStorage.getItem(this.storageKeys.appointments)) || [];
                appointments.push({
                    ...appointmentData,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString(),
                    projectName: this.projectName
                });
                localStorage.setItem(this.storageKeys.appointments, JSON.stringify(appointments));
                return { success: true, data: appointmentData };
            } else {
                // API kullanarak randevu ekle
                const response = await fetch(`${this.apiEndpoint}/appointments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Project-Name': this.projectName
                    },
                    body: JSON.stringify(appointmentData)
                });
                
                if (!response.ok) {
                    throw new Error('Randevu eklenirken hata oluştu');
                }
                
                const data = await response.json();
                return { success: true, data };
            }
        } catch (error) {
            console.error('Randevu ekleme hatası:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Tüm randevuları getirme
    async getAppointments() {
        try {
            if (this.useLocalStorage) {
                // localStorage kullanarak randevuları getir
                const appointments = JSON.parse(localStorage.getItem(this.storageKeys.appointments)) || [];
                return { success: true, data: appointments };
            } else {
                // API kullanarak randevuları getir
                const response = await fetch(`${this.apiEndpoint}/appointments`, {
                    headers: {
                        'X-Project-Name': this.projectName
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Randevular getirilirken hata oluştu');
                }
                
                const data = await response.json();
                return { success: true, data };
            }
        } catch (error) {
            console.error('Randevular getirme hatası:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Randevu güncelleme
    async updateAppointment(id, updateData) {
        try {
            if (this.useLocalStorage) {
                // localStorage kullanarak randevu güncelle
                let appointments = JSON.parse(localStorage.getItem(this.storageKeys.appointments)) || [];
                const index = appointments.findIndex(apt => apt.id === id);
                
                if (index !== -1) {
                    appointments[index] = { ...appointments[index], ...updateData };
                    localStorage.setItem(this.storageKeys.appointments, JSON.stringify(appointments));
                    return { success: true, data: appointments[index] };
                } else {
                    throw new Error('Randevu bulunamadı');
                }
            } else {
                // API kullanarak randevu güncelle
                const response = await fetch(`${this.apiEndpoint}/appointments/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Project-Name': this.projectName
                    },
                    body: JSON.stringify(updateData)
                });
                
                if (!response.ok) {
                    throw new Error('Randevu güncellenirken hata oluştu');
                }
                
                const data = await response.json();
                return { success: true, data };
            }
        } catch (error) {
            console.error('Randevu güncelleme hatası:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Randevu silme
    async deleteAppointment(id) {
        try {
            if (this.useLocalStorage) {
                // localStorage kullanarak randevu sil
                let appointments = JSON.parse(localStorage.getItem(this.storageKeys.appointments)) || [];
                const filteredAppointments = appointments.filter(apt => apt.id !== id);
                localStorage.setItem(this.storageKeys.appointments, JSON.stringify(filteredAppointments));
                return { success: true };
            } else {
                // API kullanarak randevu sil
                const response = await fetch(`${this.apiEndpoint}/appointments/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-Project-Name': this.projectName
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Randevu silinirken hata oluştu');
                }
                
                return { success: true };
            }
        } catch (error) {
            console.error('Randevu silme hatası:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Tarihe göre randevu getirme
    async getAppointmentsByDate(date) {
        try {
            const result = await this.getAppointments();
            
            if (result.success) {
                const filteredAppointments = result.data.filter(apt => apt.date === date);
                return { success: true, data: filteredAppointments };
            } else {
                return result;
            }
        } catch (error) {
            console.error('Tarihe göre randevu getirme hatası:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Sayfa içeriği kaydetme
    async savePageContent(pageName, content) {
        try {
            if (this.useLocalStorage) {
                // localStorage kullanarak sayfa içeriği kaydet
                const pageContents = JSON.parse(localStorage.getItem(this.storageKeys.pageContents)) || {};
                pageContents[pageName] = {
                    ...content,
                    updatedAt: new Date().toISOString(),
                    projectName: this.projectName
                };
                localStorage.setItem(this.storageKeys.pageContents, JSON.stringify(pageContents));
                return { success: true, data: content };
            } else {
                // API kullanarak sayfa içeriği kaydet
                const response = await fetch(`${this.apiEndpoint}/pages/${pageName}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Project-Name': this.projectName
                    },
                    body: JSON.stringify(content)
                });
                
                if (!response.ok) {
                    throw new Error('Sayfa içeriği kaydedilirken hata oluştu');
                }
                
                const data = await response.json();
                return { success: true, data };
            }
        } catch (error) {
            console.error('Sayfa içeriği kaydetme hatası:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Sayfa içeriği getirme
    async getPageContent(pageName) {
        try {
            if (this.useLocalStorage) {
                // localStorage kullanarak sayfa içeriği getir
                const pageContents = JSON.parse(localStorage.getItem(this.storageKeys.pageContents)) || {};
                const content = pageContents[pageName] || null;
                return { success: true, data: content };
            } else {
                // API kullanarak sayfa içeriği getir
                const response = await fetch(`${this.apiEndpoint}/pages/${pageName}`, {
                    headers: {
                        'X-Project-Name': this.projectName
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Sayfa içeriği getirilirken hata oluştu');
                }
                
                const data = await response.json();
                return { success: true, data };
            }
        } catch (error) {
            console.error('Sayfa içeriği getirme hatası:', error);
            return { success: false, error: error.message };
        }
    }
}

// Veritabanı servisini oluştur
const dbService = new DatabaseService();

// Global olarak kullanılabilir yap
window.dbService = dbService;