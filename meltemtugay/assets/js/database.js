// Veritabanı bağlantısı ve CRUD işlemleri
class DatabaseService {
    constructor() {
        // Proje spesifik veritabanı bağlantı bilgileri
        this.projectName = "meltemtugay";
        this.dbUrl = "postgres://19293fc73229a1df27a5879186c4fc5dc31af97ad1a554345750868344a03a10:sk_WETZMQEwkma9BWLXkA3Dk@db.prisma.io:5432/postgres?sslmode=require";
        this.prismaUrl = "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19XRVRaTVFFd2ttYTlCV0xYa0EzRGsiLCJhcGlfa2V5IjoiMDFLODlEWTNZQ0pQUFYzREdBNTVUNzVZREUiLCJ0ZW5hbnRfaWQiOiIxOTI5M2ZjNzMyMjlhMWRmMjdhNTg3OTE4NmM0ZmM1ZGMzMWFmOTdhZDFhNTU0MzQ1NzUwODY4MzQ0YTAzYTEwIiwiaW50ZXJuYWxfc2VjcmV0IjoiNGExMmFkMzQtNmZkZS00NjhkLWFlYmItNmVhNTZhNTIxYzg5In0.qgEK1zWVoU1x1cNu8ARuu0Q0--nf9R3YPb4LdjqbbKo";
        
        // Vercel'de çalışırken API endpoint kullanacağız
        this.apiEndpoint = "/api";
        
        // Ana site API endpoint'i (senkronizasyon için)
        this.mainSiteApiEndpoint = "https://meltemtugay.com/api";
        
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
            const appointmentWithId = {
                ...appointmentData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                projectName: this.projectName
            };
            
            if (this.useLocalStorage) {
                // localStorage kullanarak randevu ekle
                let appointments = JSON.parse(localStorage.getItem(this.storageKeys.appointments)) || [];
                appointments.push(appointmentWithId);
                localStorage.setItem(this.storageKeys.appointments, JSON.stringify(appointments));
                
                // Ana site ile senkronize et
                this.syncAppointmentToMainSite(appointmentWithId);
                
                return { success: true, data: appointmentWithId };
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
    
    // Tüm sayfa içeriklerini getirme
    async getAllPageContents() {
        try {
            if (this.useLocalStorage) {
                // localStorage kullanarak tüm sayfa içeriklerini getir
                const pageContents = JSON.parse(localStorage.getItem(this.storageKeys.pageContents)) || {};
                return { success: true, data: pageContents };
            } else {
                // API kullanarak tüm sayfa içeriklerini getir
                const response = await fetch(`${this.apiEndpoint}/pages`, {
                    headers: {
                        'X-Project-Name': this.projectName
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Sayfa içerikleri getirilirken hata oluştu');
                }
                
                const data = await response.json();
                return { success: true, data };
            }
        } catch (error) {
            console.error('Sayfa içerikleri getirme hatası:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Sayfa içeriği silme
    async deletePageContent(pageName) {
        try {
            if (this.useLocalStorage) {
                // localStorage kullanarak sayfa içeriğini sil
                const pageContents = JSON.parse(localStorage.getItem(this.storageKeys.pageContents)) || {};
                delete pageContents[pageName];
                localStorage.setItem(this.storageKeys.pageContents, JSON.stringify(pageContents));
                return { success: true };
            } else {
                // API kullanarak sayfa içeriğini sil
                const response = await fetch(`${this.apiEndpoint}/pages/${pageName}`, {
                    method: 'DELETE',
                    headers: {
                        'X-Project-Name': this.projectName
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Sayfa içeriği silinirken hata oluştu');
                }
                
                return { success: true };
            }
        } catch (error) {
            console.error('Sayfa içeriği silme hatası:', error);
            return { success: false, error: error.message };
        }
    }
    
    // HTML dosyasından içerik çıkarma
    async extractContentFromHTML(filePath) {
        try {
            // Dosya yolunu düzelt
            let correctedPath = filePath;
            if (!filePath.startsWith('../') && !filePath.startsWith('/')) {
                correctedPath = '../' + filePath;
            }
            
            const response = await fetch(correctedPath);
            if (!response.ok) {
                throw new Error('HTML dosyası okunamadı');
            }
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Başlık
            const title = doc.querySelector('title')?.textContent || '';
            
            // Meta description
            const metaDescription = doc.querySelector('meta[name="description"]')?.content || '';
            
            // Hero bölümü
            const heroTitle = doc.querySelector('#banner-caption h1')?.innerHTML || '';
            const heroDescription = doc.querySelector('#banner-caption p')?.innerHTML || '';
            
            // Hakkımda bölümü
            const aboutTitle = doc.querySelector('#hakkimda-content h2')?.innerHTML || '';
            const aboutDescription = doc.querySelector('#hakkimda-content p')?.innerHTML || '';
            
            // Nasıl çalışır bölümü
            const howItWorksTitle = doc.querySelector('#nasil-calisir h2')?.innerHTML || '';
            const howItWorksDescription = doc.querySelector('#nasil-calisir p')?.innerHTML || '';
            
            // Blog yazıları
            const blogPosts = [];
            doc.querySelectorAll('.blog-carousel-v2 .card-blog-box').forEach(post => {
                const title = post.querySelector('.card-title')?.textContent || '';
                const description = post.querySelector('.card-text')?.textContent || '';
                const category = post.querySelector('.blog-datetime')?.textContent || '';
                const image = post.querySelector('.card-img-top')?.src || '';
                
                blogPosts.push({ title, description, category, image });
            });
            
            return {
                success: true,
                data: {
                    title,
                    metaDescription,
                    hero: {
                        title: heroTitle,
                        description: heroDescription
                    },
                    about: {
                        title: aboutTitle,
                        description: aboutDescription
                    },
                    howItWorks: {
                        title: howItWorksTitle,
                        description: howItWorksDescription
                    },
                    blogPosts
                }
            };
        } catch (error) {
            console.error('HTML içerik çıkarma hatası:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Ana site ile randevu senkronizasyonu
    async syncAppointmentToMainSite(appointmentData) {
        try {
            const response = await fetch(`${this.mainSiteApiEndpoint}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Project-Name': this.projectName
                },
                body: JSON.stringify(appointmentData)
            });
            
            if (!response.ok) {
                console.error('Ana site ile senkronizasyon başarısız:', response.statusText);
                return { success: false, error: 'Ana site ile senkronizasyon başarısız' };
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Ana site ile senkronizasyon hatası:', error);
            return { success: false, error: 'Ana site ile senkronizasyon hatası' };
        }
    }
}

// Veritabanı servisini oluştur
const dbService = new DatabaseService();

// Global olarak kullanılabilir yap
window.dbService = dbService;