import axios, { AxiosResponse } from 'axios';
import {
  UetdsUser,
  UetdsSeferBilgileri,
  UetdsYolcuBilgileri,
  UetdsPersonelBilgileri,
  UetdsGrupBilgileri,
  UetdsResponse
} from '../types';
import { UETDS_CONFIG } from '../constants';

class UetdsService {
  private wsdlUrl: string;
  private isTestMode: boolean;

  constructor(isTestMode: boolean = true) {
    this.isTestMode = isTestMode;
    this.wsdlUrl = isTestMode 
      ? UETDS_CONFIG.TEST_URL
      : UETDS_CONFIG.PROD_URL;
  }

  private getCredentials(kullaniciAdi: string, sifre: string) {
    return {
      kullaniciAdi,
      sifre
    };
  }

  private async createSoapRequest(method: string, params: any) {
    const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Header/>
        <soapenv:Body>
          <web:${method} xmlns:web="http://tempuri.org/">
            ${Object.entries(params).map(([key, value]) => {
              if (typeof value === 'object') {
                return Object.entries(value).map(([subKey, subValue]) => 
                  `<web:${subKey}>${subValue}</web:${subKey}>`
                ).join('');
              }
              return `<web:${key}>${value}</web:${key}>`;
            }).join('')}
          </web:${method}>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    return soapEnvelope;
  }

  private async makeSoapCall(method: string, params: any): Promise<any> {
    try {
      const soapRequest = await this.createSoapRequest(method, params);
      
      const response: AxiosResponse<any> = await axios.post(
        this.wsdlUrl,
        soapRequest,
        {
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': `http://tempuri.org/${method}`,
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      // Parse SOAP response
      const soapResponse = response.data;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(soapResponse, 'text/xml');
      
      const result = xmlDoc.getElementsByTagName(`${method}Response`)[0];
      const returnElement = result?.getElementsByTagName('return')[0];
      
      if (returnElement) {
        return this.parseSoapResponse(returnElement);
      }
      
      throw new Error('Invalid SOAP response');
    } catch (error) {
      console.error(`UETDS ${method} error:`, error);
      throw new Error(`UETDS servisi ile iletişim kurulamadı: ${error}`);
    }
  }

  private parseSoapResponse(element: any): any {
    const result: any = {};
    
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i];
      if (child.tagName) {
        const tagName = child.tagName.replace(/.*:/, '');
        result[tagName] = child.textContent || child.innerHTML;
      }
    }
    
    return result;
  }

  // 1. Servis Test
  async servisTest(testMsj: string = 'Test'): Promise<UetdsResponse> {
    try {
      const result = await this.makeSoapCall('servisTest', {
        testMsj1: testMsj
      });
      
      return {
        sonucKodu: 0,
        sonucMesaji: result.testMsj1 || 'Test başarılı'
      };
    } catch (error) {
      return {
        sonucKodu: -1,
        sonucMesaji: 'Servis test hatası'
      };
    }
  }

  // 2. Sefer Ekle
  async seferEkle(
    kullaniciAdi: string,
    sifre: string,
    seferBilgileri: UetdsSeferBilgileri
  ): Promise<UetdsResponse> {
    try {
      const result = await this.makeSoapCall('seferEkle', {
        wsuser: this.getCredentials(kullaniciAdi, sifre),
        ariziSeferBilgileriInput: seferBilgileri
      });

      return {
        sonucKodu: result.sonucKodu || 0,
        sonucMesaji: result.sonucMesaji || 'Sefer başarıyla eklendi',
        uetdsSeferReferansNo: result.uetdsSeferReferansNo
      };
    } catch (error) {
      return {
        sonucKodu: -1,
        sonucMesaji: 'Sefer ekleme hatası'
      };
    }
  }

  // 3. Sefer Güncelle
  async seferGuncelle(
    kullaniciAdi: string,
    sifre: string,
    uetdsSeferReferansNo: number,
    seferBilgileri: UetdsSeferBilgileri
  ): Promise<UetdsResponse> {
    try {
      const result = await this.makeSoapCall('seferGuncelle', {
        wsuser: this.getCredentials(kullaniciAdi, sifre),
        guncellenecekSeferReferansNo: uetdsSeferReferansNo,
        ariziSeferBilgileriInput: seferBilgileri
      });

      return {
        sonucKodu: result.sonucKodu || 0,
        sonucMesaji: result.sonucMesaji || 'Sefer başarıyla güncellendi',
        uetdsSeferReferansNo: result.uetdsSeferReferansNo
      };
    } catch (error) {
      return {
        sonucKodu: -1,
        sonucMesaji: 'Sefer güncelleme hatası'
      };
    }
  }

  // 4. Sefer İptal
  async seferIptal(
    kullaniciAdi: string,
    sifre: string,
    uetdsSeferReferansNo: number,
    iptalAciklama: string
  ): Promise<UetdsResponse> {
    try {
      const result = await this.makeSoapCall('seferIptal', {
        wsuser: this.getCredentials(kullaniciAdi, sifre),
        uetdsSeferReferansNo,
        iptalAciklama
      });

      return {
        sonucKodu: result.sonucKodu || 0,
        sonucMesaji: result.sonucMesaji || 'Sefer başarıyla iptal edildi'
      };
    } catch (error) {
      return {
        sonucKodu: -1,
        sonucMesaji: 'Sefer iptal hatası'
      };
    }
  }

  // 5. Yolcu Ekle
  async yolcuEkle(
    kullaniciAdi: string,
    sifre: string,
    uetdsSeferReferansNo: number,
    yolcuBilgileri: UetdsYolcuBilgileri
  ): Promise<UetdsResponse> {
    try {
      const result = await this.makeSoapCall('yolcuEkle', {
        wsuser: this.getCredentials(kullaniciAdi, sifre),
        uetdsSeferReferansNo,
        seferYolcuBilgileriInput: yolcuBilgileri
      });

      return {
        sonucKodu: result.sonucKodu || 0,
        sonucMesaji: result.sonucMesaji || 'Yolcu başarıyla eklendi',
        uetdsYolcuRefNo: result.uetdsYolcuRefNo
      };
    } catch (error) {
      return {
        sonucKodu: -1,
        sonucMesaji: 'Yolcu ekleme hatası'
      };
    }
  }

  // 6. Çoklu Yolcu Ekle
  async yolcuEkleCoklu(
    kullaniciAdi: string,
    sifre: string,
    uetdsSeferReferansNo: number,
    yolcuBilgileriListesi: UetdsYolcuBilgileri[]
  ): Promise<UetdsResponse> {
    try {
      const yolcuBilgileri = yolcuBilgileriListesi.map((yolcu, index) => ({
        ...yolcu,
        [`yolcu${index + 1}`]: yolcu
      }));

      const result = await this.makeSoapCall('yolcuEkleCoklu', {
        wsuser: this.getCredentials(kullaniciAdi, sifre),
        uetdsSeferReferansNo,
        yolcuBilgileri
      });

      return {
        sonucKodu: result.sonucKodu || 0,
        sonucMesaji: result.sonucMesaji || 'Yolcular başarıyla eklendi'
      };
    } catch (error) {
      return {
        sonucKodu: -1,
        sonucMesaji: 'Çoklu yolcu ekleme hatası'
      };
    }
  }

  // 7. Personel Ekle
  async personelEkle(
    kullaniciAdi: string,
    sifre: string,
    uetdsSeferReferansNo: number,
    personelBilgileri: UetdsPersonelBilgileri
  ): Promise<UetdsResponse> {
    try {
      const result = await this.makeSoapCall('personelEkle', {
        wsuser: this.getCredentials(kullaniciAdi, sifre),
        uetdsSeferReferansNo,
        seferPersonelBilgileriInput: personelBilgileri
      });

      return {
        sonucKodu: result.sonucKodu || 0,
        sonucMesaji: result.sonucMesaji || 'Personel başarıyla eklendi'
      };
    } catch (error) {
      return {
        sonucKodu: -1,
        sonucMesaji: 'Personel ekleme hatası'
      };
    }
  }

  // 8. Grup Ekle
  async seferGrupEkle(
    kullaniciAdi: string,
    sifre: string,
    uetdsSeferReferansNo: number,
    grupBilgileri: UetdsGrupBilgileri
  ): Promise<UetdsResponse> {
    try {
      const result = await this.makeSoapCall('seferGrupEkle', {
        wsuser: this.getCredentials(kullaniciAdi, sifre),
        uetdsSeferReferansNo,
        seferGrupBilgileriInput: grupBilgileri
      });

      return {
        sonucKodu: result.sonucKodu || 0,
        sonucMesaji: result.sonucMesaji || 'Grup başarıyla eklendi',
        uetdsGrupRefNo: result.uetdsGrupRefNo
      };
    } catch (error) {
      return {
        sonucKodu: -1,
        sonucMesaji: 'Grup ekleme hatası'
      };
    }
  }

  // 9. Bildirim Özeti
  async bildirimOzeti(
    kullaniciAdi: string,
    sifre: string,
    uetdsSeferReferansNo: number
  ): Promise<any> {
    try {
      const result = await this.makeSoapCall('bildirimOzeti', {
        wsuser: this.getCredentials(kullaniciAdi, sifre),
        uetdsSeferReferansNo
      });

      return result;
    } catch (error) {
      throw new Error('Bildirim özeti alınamadı');
    }
  }

  // 10. Kullanıcı Kontrol
  async kullaniciKontrol(
    kullaniciAdi: string,
    sifre: string
  ): Promise<UetdsResponse> {
    try {
      const result = await this.makeSoapCall('kullaniciKontrol', {
        kullaniciAdi,
        sifre
      });

      return {
        sonucKodu: result.sonucKodu || 0,
        sonucMesaji: result.sonucMesaji || 'Kullanıcı doğrulandı'
      };
    } catch (error) {
      return {
        sonucKodu: -1,
        sonucMesaji: 'Kullanıcı kontrol hatası'
      };
    }
  }
}

// DOM Parser for parsing SOAP responses
class DOMParser {
  parseFromString(xmlString: string, mimeType: string): Document {
    // Simple XML parser implementation
    // In a real app, you would use a proper XML parser library
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, mimeType);
  }
}

// Singleton instance
export const uetdsService = new UetdsService(true); // Default to test mode