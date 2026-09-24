/*
================================================================================
                               YAKALA ZAMANI
                         JAVASCRIPT ÇEKİRDEK KODLARI
================================================================================
Geri sayım hesaplamaları, etkinlik yönetimi (ekleme/silme), 
kategori filtreleme, arama, tema değiştirme ve dinamik kart oluşturma.
*/

// ==================== VARSAYILAN ETKİNLİKLER ====================
// Sabit etkinlikler: Milli bayramlar, dini bayramlar, önemli günler ve sınavlar.
// Her etkinlik kendi yenilenme kuralına (yıllık sabit gün veya Hicri takvim) sahiptir.
// Gün geçtikten sonra insan eli değmeden otomatik olarak önümüzdeki yıla ve yeni tarihe güncellenir.
const VARSAYILAN_ETKINLIKLER = [
    {
        id: 'etkinlik_cumhuriyet',
        baslik: '29 Ekim Cumhuriyet Bayramı',
        kategori: 'milli',
        kategoriAdi: 'Milli Bayram',
        rozetRenk: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
        tekrarTuru: 'yillik',
        sabitAy: 10,
        sabitGun: 29,
        sabitSaat: '00:00',
        baslangicYili: 1923,
        aciklamaUret: (yil) => `Cumhuriyetimizin ${yil - 1923}. yılı.`,
        tarihStr: '2026-10-29T00:00:00',
        aciklama: 'Cumhuriyetimizin 103. yılı.',
        sabit: true,
        ikon: `<svg class="inline-block rounded-[3px] shadow-xs align-middle" style="width: 1.7em; height: 1.2em; vertical-align: -0.2em;" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#E30A17"/><circle cx="425" cy="400" r="200" fill="#ffffff"/><circle cx="475" cy="400" r="160" fill="#E30A17"/><polygon points="583.3,400 706.7,438.2 630.5,338.2 630.5,461.8 706.7,361.8" fill="#ffffff"/></svg>`
    },
    {
        id: 'etkinlik_ramazan',
        baslik: 'Ramazan Bayramı',
        kategori: 'dini',
        kategoriAdi: 'Dini Bayram',
        rozetRenk: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        tekrarTuru: 'hicri',
        diniTarihler: [
            '2026-03-20', '2027-03-09', '2028-02-26', '2029-02-15',
            '2030-02-04', '2031-01-24', '2032-01-14', '2033-01-02',
            '2033-12-23', '2034-12-12', '2035-12-02'
        ],
        tarihStr: '2027-03-09T00:00:00',
        aciklama: 'Ramazan Bayramı 1. Günü.',
        sabit: true,
        ikon: '🌙'
    },
    {
        id: 'etkinlik_23nisan',
        baslik: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı',
        kategori: 'milli',
        kategoriAdi: 'Milli Bayram',
        rozetRenk: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
        tekrarTuru: 'yillik',
        sabitAy: 4,
        sabitGun: 23,
        sabitSaat: '00:00',
        baslangicYili: 1920,
        aciklamaUret: (yil) => `TBMM'nin açılışının ${yil - 1920}. yılı ve Çocuk Bayramı.`,
        tarihStr: '2027-04-23T00:00:00',
        aciklama: 'TBMM\'nin açılışı ve Çocuk Bayramı.',
        sabit: true,
        ikon: '🎈'
    },
    {
        id: 'etkinlik_kurban',
        baslik: 'Kurban Bayramı',
        kategori: 'dini',
        kategoriAdi: 'Dini Bayram',
        rozetRenk: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        tekrarTuru: 'hicri',
        diniTarihler: [
            '2026-05-27', '2027-05-16', '2028-05-05', '2029-04-24',
            '2030-04-13', '2031-04-03', '2032-03-22', '2033-03-12',
            '2034-03-01', '2035-02-18'
        ],
        tarihStr: '2027-05-16T00:00:00',
        aciklama: 'Kurban Bayramı 1. Günü.',
        sabit: true,
        ikon: '🐑'
    },
    // ==================== 2026 YILINDA HENÜZ UYGULANMAMIŞ SINAVLAR ====================
    {
        id: 'etkinlik_kpss_onlisans',
        baslik: 'KPSS Ön Lisans Sınavı',
        kategori: 'sinav',
        kategoriAdi: 'Kamu Sınavı',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2026-10-04T10:15:00',
        aciklama: 'Kamu Personel Seçme Sınavı Ön Lisans oturumu.',
        sabit: true,
        ikon: '🏛️',
        tekrarTuru: 'sinav',
        sinavTuru: 'kpss_onlisans',
        resmi: true,
        tahmini: false,
        kurum: 'ÖSYM'
    },
    {
        id: 'etkinlik_kpss_ortaogretim',
        baslik: 'KPSS Ortaöğretim Sınavı',
        kategori: 'sinav',
        kategoriAdi: 'Kamu Sınavı',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2026-10-25T10:15:00',
        aciklama: 'Kamu Personel Seçme Sınavı Ortaöğretim oturumu.',
        sabit: true,
        ikon: '🏛️',
        tekrarTuru: 'sinav',
        sinavTuru: 'kpss_ortaogretim',
        resmi: true,
        tahmini: false,
        kurum: 'ÖSYM'
    },
    {
        id: 'etkinlik_yds_2',
        baslik: '2026-YDS/2 (Sonbahar Dönemi)',
        kategori: 'sinav',
        kategoriAdi: 'Dil Sınavı',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2026-11-15T10:15:00',
        aciklama: 'Yabancı Dil Bilgisi Seviye Tespit Sınavı 2. oturumu.',
        sabit: true,
        ikon: '🌐',
        tekrarTuru: 'sinav',
        sinavTuru: 'yds_2',
        resmi: true,
        tahmini: false,
        kurum: 'ÖSYM'
    },
    {
        id: 'etkinlik_ales_3',
        baslik: '2026-ALES/3 (Sonbahar Dönemi)',
        kategori: 'sinav',
        kategoriAdi: 'Akademik Sınav',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2026-11-22T10:15:00',
        aciklama: 'Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı 3. oturumu.',
        sabit: true,
        ikon: '🎓',
        tekrarTuru: 'sinav',
        sinavTuru: 'ales_3',
        resmi: true,
        tahmini: false,
        kurum: 'ÖSYM'
    },

    // ==================== 2026'DA UYGULANMIŞ VE GEÇMİŞ VERİ ANALİZİYLE 2027 TAHMİNİ TARİHİ BELİRLENEN SINAVLAR ====================
    {
        id: 'etkinlik_yds_1',
        baslik: '2027-YDS/1 (İlkbahar Dönemi)',
        kategori: 'sinav',
        kategoriAdi: 'Dil Sınavı',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2027-04-04T10:15:00',
        aciklama: 'Yabancı Dil Bilgisi Seviye Tespit Sınavı 1. oturumu (Tahmini Tarih).',
        sabit: true,
        ikon: '🌐',
        tekrarTuru: 'sinav',
        sinavTuru: 'yds_1',
        resmi: false,
        tahmini: true,
        kurum: 'ÖSYM'
    },
    {
        id: 'etkinlik_ales_1',
        baslik: '2027-ALES/1 (İlkbahar Dönemi)',
        kategori: 'sinav',
        kategoriAdi: 'Akademik Sınav',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2027-04-18T10:15:00',
        aciklama: 'Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı 1. oturumu (Tahmini Tarih).',
        sabit: true,
        ikon: '🎓',
        tekrarTuru: 'sinav',
        sinavTuru: 'ales_1',
        resmi: false,
        tahmini: true,
        kurum: 'ÖSYM'
    },
    {
        id: 'etkinlik_lgs',
        baslik: '2027-LGS (Liselere Geçiş Sınavı)',
        kategori: 'sinav',
        kategoriAdi: 'MEB Sınavı',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2027-06-06T09:30:00',
        aciklama: 'Milli Eğitim Bakanlığı Liselere Geçiş Sınavı (Tahmini Tarih).',
        sabit: true,
        ikon: '🎒',
        tekrarTuru: 'sinav',
        sinavTuru: 'lgs',
        resmi: false,
        tahmini: true,
        kurum: 'MEB'
    },
    {
        id: 'etkinlik_tyt',
        baslik: 'TYT Sınavı (YKS 1. Oturum)',
        kategori: 'sinav',
        kategoriAdi: 'Üniversite Sınavı',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2027-06-19T10:15:00',
        aciklama: 'Temel Yeterlilik Testi (Tahmini Tarih).',
        sabit: true,
        ikon: '🎯',
        tekrarTuru: 'sinav',
        sinavTuru: 'yks_tyt',
        resmi: false,
        tahmini: true,
        kurum: 'ÖSYM'
    },
    {
        id: 'etkinlik_ayt',
        baslik: 'AYT Sınavı (YKS 2. Oturum)',
        kategori: 'sinav',
        kategoriAdi: 'Üniversite Sınavı',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2027-06-20T10:15:00',
        aciklama: 'Alan Yeterlilik Testi (Tahmini Tarih).',
        sabit: true,
        ikon: '🎯',
        tekrarTuru: 'sinav',
        sinavTuru: 'yks_ayt',
        resmi: false,
        tahmini: true,
        kurum: 'ÖSYM'
    },
    {
        id: 'etkinlik_ydt',
        baslik: 'YDT Sınavı (YKS 3. Oturum)',
        kategori: 'sinav',
        kategoriAdi: 'Üniversite Sınavı',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2027-06-20T15:45:00',
        aciklama: 'Yabancı Dil Testi (Tahmini Tarih).',
        sabit: true,
        ikon: '🎯',
        tekrarTuru: 'sinav',
        sinavTuru: 'yks_ydt',
        resmi: false,
        tahmini: true,
        kurum: 'ÖSYM'
    },
    {
        id: 'etkinlik_ales_2',
        baslik: '2027-ALES/2 (Yaz Dönemi)',
        kategori: 'sinav',
        kategoriAdi: 'Akademik Sınav',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2027-07-11T10:15:00',
        aciklama: 'Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı 2. oturumu (Tahmini Tarih).',
        sabit: true,
        ikon: '🎓',
        tekrarTuru: 'sinav',
        sinavTuru: 'ales_2',
        resmi: false,
        tahmini: true,
        kurum: 'ÖSYM'
    },
    {
        id: 'etkinlik_dgs',
        baslik: '2027-DGS (Dikey Geçiş Sınavı)',
        kategori: 'sinav',
        kategoriAdi: 'Üniversite Sınavı',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2027-07-18T10:15:00',
        aciklama: 'Ön Lisans Mezunları Dikey Geçiş Sınavı (Tahmini Tarih).',
        sabit: true,
        ikon: '📈',
        tekrarTuru: 'sinav',
        sinavTuru: 'dgs',
        resmi: false,
        tahmini: true,
        kurum: 'ÖSYM'
    },
    {
        id: 'etkinlik_kpss_lisans',
        baslik: '2027-KPSS Lisans (Genel Yetenek - Genel Kültür)',
        kategori: 'sinav',
        kategoriAdi: 'Kamu Sınavı',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2027-09-05T10:15:00',
        aciklama: 'Kamu Personel Seçme Sınavı Lisans GY-GK oturumu (Tahmini Tarih).',
        sabit: true,
        ikon: '🏛️',
        tekrarTuru: 'sinav',
        sinavTuru: 'kpss_lisans',
        resmi: false,
        tahmini: true,
        kurum: 'ÖSYM'
    },
    {
        id: 'etkinlik_kpss_alan',
        baslik: '2027-KPSS Lisans Alan Bilgisi',
        kategori: 'sinav',
        kategoriAdi: 'Kamu Sınavı',
        rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tarihStr: '2027-09-11T10:15:00',
        aciklama: 'Kamu Personel Seçme Sınavı Alan Bilgisi Oturumları 1. Gün (Tahmini Tarih).',
        sabit: true,
        ikon: '🏛️',
        tekrarTuru: 'sinav',
        sinavTuru: 'kpss_alan',
        resmi: false,
        tahmini: true,
        kurum: 'ÖSYM'
    },
    // ==================== MİLLİ BAYRAMLAR (YENİ) ====================
    {
        id: 'etkinlik_19mayis',
        baslik: '19 Mayıs Atatürk\'ü Anma Gençlik ve Spor Bayramı',
        kategori: 'milli',
        kategoriAdi: 'Milli Bayram',
        rozetRenk: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
        tekrarTuru: 'yillik',
        sabitAy: 5,
        sabitGun: 19,
        sabitSaat: '00:00',
        baslangicYili: 1919,
        aciklamaUret: (yil) => `Atatürk'ün Samsun'a çıkışının ${yil - 1919}. yılı ve Gençlik ve Spor Bayramı.`,
        tarihStr: '2027-05-19T00:00:00',
        aciklama: 'Atatürk\'ün Samsun\'a çıkışı ve Gençlik ve Spor Bayramı.',
        sabit: true,
        ikon: `<svg class="inline-block rounded-[3px] shadow-xs align-middle" style="width: 1.7em; height: 1.2em; vertical-align: -0.2em;" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#E30A17"/><circle cx="425" cy="400" r="200" fill="#ffffff"/><circle cx="475" cy="400" r="160" fill="#E30A17"/><polygon points="583.3,400 706.7,438.2 630.5,338.2 630.5,461.8 706.7,361.8" fill="#ffffff"/></svg>`
    },
    {
        id: 'etkinlik_30agustos',
        baslik: '30 Ağustos Zafer Bayramı',
        kategori: 'milli',
        kategoriAdi: 'Milli Bayram',
        rozetRenk: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
        tekrarTuru: 'yillik',
        sabitAy: 8,
        sabitGun: 30,
        sabitSaat: '00:00',
        baslangicYili: 1922,
        aciklamaUret: (yil) => `Büyük Taarruz Zaferi'nin ${yil - 1922}. yılı.`,
        tarihStr: '2027-08-30T00:00:00',
        aciklama: 'Büyük Taarruz\'un zafere ulaştığı gün.',
        sabit: true,
        ikon: `<svg class="inline-block rounded-[3px] shadow-xs align-middle" style="width: 1.7em; height: 1.2em; vertical-align: -0.2em;" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#E30A17"/><circle cx="425" cy="400" r="200" fill="#ffffff"/><circle cx="475" cy="400" r="160" fill="#E30A17"/><polygon points="583.3,400 706.7,438.2 630.5,338.2 630.5,461.8 706.7,361.8" fill="#ffffff"/></svg>`
    },
    // ==================== ÖNEMLİ GÜNLER ====================
    {
        id: 'etkinlik_yilbasi',
        baslik: '1 Ocak Yılbaşı',
        kategori: 'onemli',
        kategoriAdi: 'Önemli Gün',
        rozetRenk: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
        tekrarTuru: 'yillik',
        sabitAy: 1,
        sabitGun: 1,
        sabitSaat: '00:00',
        aciklamaUret: (yil) => `${yil} yılının ilk günü.`,
        tarihStr: '2027-01-01T00:00:00',
        aciklama: 'Yeni yılın ilk günü.',
        sabit: true,
        ikon: '🎆'
    },
    {
        id: 'etkinlik_12mart',
        baslik: '12 Mart İstiklal Marşı\'nın Kabulü',
        kategori: 'onemli',
        kategoriAdi: 'Önemli Gün',
        rozetRenk: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
        tekrarTuru: 'yillik',
        sabitAy: 3,
        sabitGun: 12,
        sabitSaat: '00:00',
        baslangicYili: 1921,
        aciklamaUret: (yil) => `İstiklal Marşımızın TBMM tarafından kabul edilişinin ${yil - 1921}. yılı.`,
        tarihStr: '2027-03-12T00:00:00',
        aciklama: 'İstiklal Marşımızın TBMM tarafından kabul edilişi.',
        sabit: true,
        ikon: '📜'
    },
    {
        id: 'etkinlik_18mart',
        baslik: '18 Mart Çanakkale Zaferi',
        kategori: 'onemli',
        kategoriAdi: 'Önemli Gün',
        rozetRenk: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
        tekrarTuru: 'yillik',
        sabitAy: 3,
        sabitGun: 18,
        sabitSaat: '00:00',
        baslangicYili: 1915,
        aciklamaUret: (yil) => `Çanakkale Deniz Zaferi'nin ${yil - 1915}. yılı ve Şehitleri Anma Günü.`,
        tarihStr: '2027-03-18T00:00:00',
        aciklama: 'Çanakkale Deniz Zaferi ve Şehitleri Anma Günü.',
        sabit: true,
        ikon: '⚔️'
    },
    {
        id: 'etkinlik_1mayis',
        baslik: '1 Mayıs Emek ve Dayanışma Günü',
        kategori: 'onemli',
        kategoriAdi: 'Önemli Gün',
        rozetRenk: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
        tekrarTuru: 'yillik',
        sabitAy: 5,
        sabitGun: 1,
        sabitSaat: '00:00',
        aciklamaUret: () => 'İşçi Bayramı — Emek ve Dayanışma Günü.',
        tarihStr: '2027-05-01T00:00:00',
        aciklama: 'İşçi Bayramı — Emek ve Dayanışma Günü.',
        sabit: true,
        ikon: '✊'
    },
    {
        id: 'etkinlik_29mayis',
        baslik: '29 Mayıs İstanbul\'un Fethi',
        kategori: 'onemli',
        kategoriAdi: 'Önemli Gün',
        rozetRenk: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
        tekrarTuru: 'yillik',
        sabitAy: 5,
        sabitGun: 29,
        sabitSaat: '00:00',
        baslangicYili: 1453,
        aciklamaUret: (yil) => `İstanbul'un fethinin ${yil - 1453}. yılı (1453).`,
        tarihStr: '2027-05-29T00:00:00',
        aciklama: 'İstanbul\'un Fatih Sultan Mehmet tarafından fethi (1453).',
        sabit: true,
        ikon: '⚔️'
    },
    {
        id: 'etkinlik_15temmuz',
        baslik: '15 Temmuz Demokrasi ve Milli Birlik Günü',
        kategori: 'onemli',
        kategoriAdi: 'Önemli Gün',
        rozetRenk: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
        tekrarTuru: 'yillik',
        sabitAy: 7,
        sabitGun: 15,
        sabitSaat: '00:00',
        baslangicYili: 2016,
        aciklamaUret: (yil) => `Demokrasi ve Milli Birlik Günü (${yil - 2016}. yılı).`,
        tarihStr: '2027-07-15T00:00:00',
        aciklama: 'Demokrasi ve Milli Birlik Günü.',
        sabit: true,
        ikon: `<svg class="inline-block rounded-[3px] shadow-xs align-middle" style="width: 1.7em; height: 1.2em; vertical-align: -0.2em;" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#E30A17"/><circle cx="425" cy="400" r="200" fill="#ffffff"/><circle cx="475" cy="400" r="160" fill="#E30A17"/><polygon points="583.3,400 706.7,438.2 630.5,338.2 630.5,461.8 706.7,361.8" fill="#ffffff"/></svg>`
    },
    {
        id: 'etkinlik_10kasim',
        baslik: '10 Kasım Atatürk\'ü Anma Günü ve Atatürk Haftası',
        kategori: 'onemli',
        kategoriAdi: 'Önemli Gün',
        rozetRenk: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
        tekrarTuru: 'yillik',
        sabitAy: 11,
        sabitGun: 10,
        sabitSaat: '09:05',
        baslangicYili: 1938,
        aciklamaUret: (yil) => `Gazi Mustafa Kemal Atatürk'ün ebediyete intikalinin ${yil - 1938}. yılı.`,
        tarihStr: '2026-11-10T09:05:00',
        aciklama: 'Gazi Mustafa Kemal Atatürk\'ün ebediyete intikali.',
        sabit: true,
        ikon: '🖤'
    },
    // ==================== DİNİ GÜNLER ====================
    {
        id: 'etkinlik_regaip',
        baslik: 'Regaip Kandili ve Üç Ayların Başlangıcı',
        kategori: 'dini',
        kategoriAdi: 'Dini Gün',
        rozetRenk: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        tekrarTuru: 'hicri',
        diniTarihler: [
            '2026-12-10', '2027-12-02', '2028-11-23', '2029-11-08',
            '2030-11-01', '2031-10-23', '2032-10-07', '2033-09-29',
            '2034-09-14', '2035-09-06'
        ],
        tarihStr: '2026-12-10T00:00:00',
        aciklama: 'Regaip Kandili — Üç Ayların başlangıcı.',
        sabit: true,
        ikon: '📿'
    },
    {
        id: 'etkinlik_mirac',
        baslik: 'Miraç Kandili',
        kategori: 'dini',
        kategoriAdi: 'Dini Gün',
        rozetRenk: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        tekrarTuru: 'hicri',
        diniTarihler: [
            '2026-01-15', '2027-01-04', '2027-12-24', '2028-12-13',
            '2029-12-03', '2030-11-23', '2031-11-12', '2032-11-01',
            '2033-10-21', '2034-10-10', '2035-09-30'
        ],
        tarihStr: '2027-01-04T00:00:00',
        aciklama: 'Hz. Muhammed\'in (s.a.v.) göğe yükselişinin anıldığı mübarek gece.',
        sabit: true,
        ikon: '🕌'
    },
    {
        id: 'etkinlik_berat',
        baslik: 'Berat Kandili',
        kategori: 'dini',
        kategoriAdi: 'Dini Gün',
        rozetRenk: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        tekrarTuru: 'hicri',
        diniTarihler: [
            '2026-02-02', '2027-01-22', '2028-01-11', '2028-12-30',
            '2029-12-21', '2030-12-10', '2031-11-30', '2032-11-18',
            '2033-11-07', '2034-10-28', '2035-10-17'
        ],
        tarihStr: '2027-01-22T00:00:00',
        aciklama: 'Günahların affedildiği ve duaların kabul edildiği mübarek gece.',
        sabit: true,
        ikon: '🤲'
    },
    {
        id: 'etkinlik_ramazan_baslangic',
        baslik: 'Ramazan-ı Şerif\'in Başlangıcı',
        kategori: 'dini',
        kategoriAdi: 'Dini Gün',
        rozetRenk: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        tekrarTuru: 'hicri',
        diniTarihler: [
            '2026-02-19', '2027-02-08', '2028-01-28', '2029-01-16',
            '2030-01-05', '2030-12-26', '2031-12-15', '2032-12-04',
            '2033-11-23', '2034-11-12', '2035-11-01'
        ],
        tarihStr: '2027-02-08T00:00:00',
        aciklama: 'Ramazan ayının ilk günü.',
        sabit: true,
        ikon: '☪️'
    },
    {
        id: 'etkinlik_kadir',
        baslik: 'Kadir Gecesi',
        kategori: 'dini',
        kategoriAdi: 'Dini Gün',
        rozetRenk: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        tekrarTuru: 'hicri',
        diniTarihler: [
            '2026-03-16', '2027-03-05', '2028-02-22', '2029-02-10',
            '2030-01-31', '2031-01-20', '2032-01-10', '2032-12-29',
            '2033-12-19', '2034-12-08', '2035-11-27'
        ],
        tarihStr: '2027-03-05T00:00:00',
        aciklama: 'Bin aydan hayırlı olan mübarek Kadir Gecesi.',
        sabit: true,
        ikon: '✨'
    },
    {
        id: 'etkinlik_mevlid',
        baslik: 'Mevlid Kandili',
        kategori: 'dini',
        kategoriAdi: 'Dini Gün',
        rozetRenk: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        tekrarTuru: 'hicri',
        diniTarihler: [
            '2026-08-24', '2027-08-13', '2028-08-02', '2029-07-23',
            '2030-07-13', '2031-07-02', '2032-06-20', '2033-06-10',
            '2034-05-30', '2035-05-20'
        ],
        tarihStr: '2027-08-13T00:00:00',
        aciklama: 'Hz. Muhammed\'in (s.a.v.) doğumunun kutlandığı mübarek gece.',
        sabit: true,
        ikon: '🕯️'
    }
];

// ==================== OTOMATİK ETKİNLİK YENİLEME SİSTEMİ ====================
// Milli bayramlar, dini günler ve sınavlar insan müdahalesine gerek kalmadan,
// günleri geçtikten sonra kendiliğinden bir sonraki yıla/tarihe güncellenir.
// Sınavlar: Tahmini Tarih -> Resmi Tarih açıklandıktan sonra Resmi Tarih ->
// Sınav günü tamamlandıktan sonra tekrardan bir sonraki dönemin Tahmini Tarihi döngüsüyle sonsuza kadar yenilenir.

/**
 * Verilen bir ISO tarih string'inin zaman damgasını milisaniye cinsinden döner.
 */
function etkinlikHedefZamani(tarihStr) {
    return new Date(tarihStr).getTime();
}

/**
 * Her yıl aynı gün olan sabit etkinlikleri (Milli bayramlar, 15 Temmuz, 18 Mart vb.) günceller.
 * Etkinliğin vakti geldiğinde 1 dakika boyunca büyüme/küçülme eylemi gerçekleşir.
 * Bu 1 dakikalık eylem tamamlandıktan sonra tarihi önümüzdeki yıla taşır.
 * Açıklamasında geçen yıl sayısını (ör. Cumhuriyet'in 103. yılı -> 104. yılı) otomatik hesaplar.
 */
function otomatikYillikEtkinlikGuncelle(etkinlik, simdi) {
    let yil = simdi.getFullYear();
    const ay = etkinlik.sabitAy;
    const gun = etkinlik.sabitGun;
    const saat = etkinlik.sabitSaat || '00:00';

    let hedefTarihStr = `${yil}-${String(ay).padStart(2, '0')}-${String(gun).padStart(2, '0')}T${saat}:00`;
    let hedefZaman = new Date(hedefTarihStr).getTime();

    // 1 dakikalık (60.000 ms) büyüme/küçülme eylemi tamamlandıktan sonra bir sonraki yıla devret
    if (simdi.getTime() >= hedefZaman + 60000) {
        yil++;
        hedefTarihStr = `${yil}-${String(ay).padStart(2, '0')}-${String(gun).padStart(2, '0')}T${saat}:00`;
    }

    etkinlik.tarihStr = hedefTarihStr;

    // Açıklamayı dinamik yıla göre güncelle
    if (typeof etkinlik.aciklamaUret === 'function') {
        etkinlik.aciklama = etkinlik.aciklamaUret(yil);
    }
}

/**
 * Hicri takvime bağlı dini günleri günceller.
 * Diyanet İşleri Başkanlığı resmi takvimindeki güncel tarihleri takip eder;
 * 1 dakikalık eylem süresi bittikten sonra sıradaki dini günün tarihini otomatik olarak ayarlar.
 * Tablo ötesi yıllarda Hicri-Miladi farkına (~354.367 gün) göre matematiksel döngüyü sürdürür.
 */
function otomatikDiniEtkinlikGuncelle(etkinlik, simdi) {
    if (!etkinlik.diniTarihler || etkinlik.diniTarihler.length === 0) return;

    // 1 dakikalık eylem süresi henüz dolmamış veya gelecekteki en yakın tarihi bul
    let secilenTarih = null;
    for (const tarih of etkinlik.diniTarihler) {
        const hedefZaman = new Date(`${tarih}T00:00:00`).getTime();
        if (simdi.getTime() < hedefZaman + 60000) {
            secilenTarih = tarih;
            break;
        }
    }

    // Tablodaki tarihler tükenirse (ör. 2035 sonrası) Hicri yıl farkı (~354.367 gün) ile hesapla
    if (!secilenTarih) {
        const sonTarihStr = etkinlik.diniTarihler[etkinlik.diniTarihler.length - 1];
        let geciciZaman = new Date(`${sonTarihStr}T00:00:00`).getTime();
        const birHicriYilMs = 354.36707 * 24 * 60 * 60 * 1000;

        while (simdi.getTime() >= geciciZaman + 60000) {
            geciciZaman += birHicriYilMs;
        }
        const yeniTarihObj = new Date(geciciZaman);
        const y = yeniTarihObj.getFullYear();
        const m = String(yeniTarihObj.getMonth() + 1).padStart(2, '0');
        const d = String(yeniTarihObj.getDate()).padStart(2, '0');
        secilenTarih = `${y}-${m}-${d}`;
    }

    etkinlik.tarihStr = `${secilenTarih}T00:00:00`;
}

// ==================== MATEMATİKSEL SINAV TAKVİMİ MOTORU ====================

/**
 * Belirtilen yıl ve ayın n'inci Pazar gününü döner.
 * n = -1 veya ayın pazar sayısından büyükse son Pazar gününü döner.
 */
function nInciPazariBul(yil, ay, n, saat = '10:15') {
    const pazarlar = [];
    for (let d = 1; d <= 31; d++) {
        const dt = new Date(yil, ay - 1, d);
        if (dt.getMonth() !== ay - 1) break;
        if (dt.getDay() === 0) {
            pazarlar.push(dt);
        }
    }
    const secilen = (n === -1 || n > pazarlar.length) ? pazarlar[pazarlar.length - 1] : pazarlar[n - 1];
    if (!secilen) return null;
    const y = secilen.getFullYear();
    const m = String(secilen.getMonth() + 1).padStart(2, '0');
    const d = String(secilen.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}T${saat}:00`;
}

/**
 * Verilen yıl için Haziran ayının 3. hafta sonundaki YKS oturum tarihlerini döner.
 */
function yksHaftaSonuTarihleri(yil) {
    const cumartesiler = [];
    const pazarlar = [];
    for (let d = 1; d <= 30; d++) {
        const dt = new Date(yil, 5, d); // 5 = Haziran
        if (dt.getDay() === 6) cumartesiler.push(dt);
        if (dt.getDay() === 0) pazarlar.push(dt);
    }
    const c3 = cumartesiler[2] || cumartesiler[cumartesiler.length - 1];
    const p3 = pazarlar[2] || pazarlar[pazarlar.length - 1];

    const fmt = (dt, saat) => {
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const d = String(dt.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}T${saat}:00`;
    };

    return {
        tyt: fmt(c3, '10:15'),
        ayt: fmt(p3, '10:15'),
        ydt: fmt(p3, '15:45')
    };
}

/**
 * Sınav türüne ve hedef yıla göre geçmiş sınav takvimi geleneklerine dayalı tahmini tarihi hesaplar.
 */
function sinavTahminiTarihHesapla(sinavTuru, yil) {
    switch (sinavTuru) {
        case 'yks_tyt':
            return yksHaftaSonuTarihleri(yil).tyt;
        case 'yks_ayt':
            return yksHaftaSonuTarihleri(yil).ayt;
        case 'yks_ydt':
            return yksHaftaSonuTarihleri(yil).ydt;
        case 'lgs':
            // Haziran ayının ilk Pazarı (09:30)
            return nInciPazariBul(yil, 6, 1, '09:30');
        case 'dgs':
            // Temmuz ayının 3. Pazarı (10:15)
            return nInciPazariBul(yil, 7, 3, '10:15');
        case 'kpss_lisans':
            // Eylül ayının ilk Pazarı (10:15)
            return nInciPazariBul(yil, 9, 1, '10:15');
        case 'kpss_alan': {
            // Eylül ayının ilk Pazarından (GY-GK) sonraki Cumartesi (10:15)
            const gyGkStr = nInciPazariBul(yil, 9, 1, '10:15');
            const gyGkDt = new Date(gyGkStr);
            const alanDt = new Date(gyGkDt.getTime() + 6 * 24 * 60 * 60 * 1000);
            const y = alanDt.getFullYear();
            const m = String(alanDt.getMonth() + 1).padStart(2, '0');
            const d = String(alanDt.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}T10:15:00`;
        }
        case 'kpss_onlisans':
            // Çift yıllar Ekim ayının ilk Pazarı (10:15)
            return nInciPazariBul(yil, 10, 1, '10:15');
        case 'kpss_ortaogretim':
            // Çift yıllar Ekim ayının 4. Pazarı (10:15)
            return nInciPazariBul(yil, 10, 4, '10:15');
        case 'yds_1':
            // Nisan ayının ilk Pazarı (10:15)
            return nInciPazariBul(yil, 4, 1, '10:15');
        case 'yds_2':
            // Kasım ayının 3. Pazarı (10:15)
            return nInciPazariBul(yil, 11, 3, '10:15');
        case 'yds_3':
            // Aralık ayının ilk Pazarı (10:15)
            return nInciPazariBul(yil, 12, 1, '10:15');
        case 'ales_1':
            // Nisan ayının 3. Pazarı (10:15)
            return nInciPazariBul(yil, 4, 3, '10:15');
        case 'ales_2':
            // Temmuz ayının 2. Pazarı (10:15)
            return nInciPazariBul(yil, 7, 2, '10:15');
        case 'ales_3':
            // Kasım ayının 4. Pazarı (10:15)
            return nInciPazariBul(yil, 11, 4, '10:15');
        default:
            return null;
    }
}

/**
 * Sınavların otomatik yaşam döngüsünü yönetir:
 * Sınavın saati gelip 1 dakikalık uyarı bittikten sonra, sınav bir sonraki yıla/döneme
 * matematiksel takvim kurallarıyla devredilir; durumu otomatik olarak "Tahmini Tarih"e döner.
 * Yeni resmi takvim açıklandığında sinav-takvimi.json dosyasından güncellenene kadar tahmini kalır.
 */
function otomatikSinavEtkinlikGuncelle(etkinlik, simdi) {
    if (!etkinlik.sinavTuru && etkinlik.kategori !== 'sinav') return;

    const hedefZaman = new Date(etkinlik.tarihStr).getTime();
    // 1 dakikalık (60.000 ms) büyüme/küçülme eylemi tamamlandıktan sonra döngü devreye girer
    if (simdi.getTime() < hedefZaman + 60000) {
        return;
    }

    // Sınav bitti! Otomatik olarak bir sonraki döneme / yıla tahmini tarihle taşı
    const mevcutTarih = new Date(etkinlik.tarihStr);
    const mevcutYil = mevcutTarih.getFullYear();
    let yeniYil = mevcutYil + 1;

    // KPSS Ön Lisans ve KPSS Ortaöğretim 2 yılda bir (çift yıllarda) uygulanır
    if (etkinlik.sinavTuru === 'kpss_onlisans' || etkinlik.sinavTuru === 'kpss_ortaogretim') {
        yeniYil = (mevcutYil % 2 === 0) ? mevcutYil + 2 : mevcutYil + 1;
        while (yeniYil < simdi.getFullYear() || (yeniYil === simdi.getFullYear() && simdi.getMonth() >= 10)) {
            yeniYil += 2;
        }
    } else {
        while (yeniYil <= simdi.getFullYear()) {
            yeniYil++;
        }
    }

    const yeniTarihStr = sinavTahminiTarihHesapla(etkinlik.sinavTuru, yeniYil);
    if (yeniTarihStr) {
        etkinlik.tarihStr = yeniTarihStr;
        // Döngü kuralı: Sınav günü geçtikten sonra tekrardan TAHMİNİ TARİH olur!
        etkinlik.resmi = false;
        etkinlik.tahmini = true;

        // Başlıktaki yıl etiketini güncelle (ör: 2026-YDS/2 -> 2027-YDS/2, 2027-LGS -> 2028-LGS)
        if (etkinlik.baslik && etkinlik.baslik.match(/\b20\d{2}\b/)) {
            etkinlik.baslik = etkinlik.baslik.replace(/\b20\d{2}\b/, yeniYil);
        }

        // Açıklamayı güncelle
        if (etkinlik.aciklama) {
            etkinlik.aciklama = etkinlik.aciklama.replace(/\(Tahmini Tarih\)/g, '').trim();
            if (!etkinlik.aciklama.endsWith('.')) etkinlik.aciklama += '.';
            etkinlik.aciklama += ' (Tahmini Tarih).';
        }
    }
}

/**
 * Tüm varsayılan etkinlikleri tarayarak yıllık, dini günleri ve sınavları günceller.
 * Herhangi bir etkinlik güncellendiyse true döner.
 */
function otomatikEtkinlikleriGuncelle(simdi = new Date()) {
    let degisiklikOlduMu = false;

    VARSAYILAN_ETKINLIKLER.forEach(etkinlik => {
        const eskiTarihStr = etkinlik.tarihStr;
        const eskiAciklama = etkinlik.aciklama;
        const eskiResmi = etkinlik.resmi;

        if (etkinlik.tekrarTuru === 'yillik') {
            otomatikYillikEtkinlikGuncelle(etkinlik, simdi);
        } else if (etkinlik.tekrarTuru === 'hicri') {
            otomatikDiniEtkinlikGuncelle(etkinlik, simdi);
        } else if (etkinlik.tekrarTuru === 'sinav' || etkinlik.kategori === 'sinav') {
            otomatikSinavEtkinlikGuncelle(etkinlik, simdi);
        }

        if (etkinlik.tarihStr !== eskiTarihStr || etkinlik.aciklama !== eskiAciklama || etkinlik.resmi !== eskiResmi) {
            degisiklikOlduMu = true;
        }
    });

    return degisiklikOlduMu;
}

// ==================== HARİCİ SINAV TAKVİMİ (HİBRİT MODEL) ====================
/**
 * Harici sinav-takvimi.json dosyasını yükler.
 * Resmi sınav takvimi açıklandığında tarihler ve resmiyet durumu bu dosyadan alınır.
 * YDS veya ALES oturum sayılarının artması veya eksilmesi durumunda listeyi otomatik uyarlar.
 */
async function sinavTakviminiYukle() {
    try {
        const yanit = await fetch('sinav-takvimi.json');
        if (!yanit.ok) return false;
        const veri = await yanit.json();
        if (veri && Array.isArray(veri.sinavlar)) {
            sinavTakviminiUygula(veri.sinavlar);
            return true;
        }
    } catch (hata) {
        // Çevrimdışı kullanımda veya yerel dosya sisteminde dahili kurallar kesintisiz çalışır
    }
    return false;
}

/**
 * Harici takvim verilerini sisteme uygular.
 * Oturum eksilmelerini (aktif: false veya listeden çıkarılanlar) ve artışlarını yönetir.
 */
function sinavTakviminiUygula(hariciSinavlar) {
    if (!Array.isArray(hariciSinavlar)) return;

    const simdi = new Date();
    const hariciMap = new Map();
    hariciSinavlar.forEach(hs => {
        if (hs.id) hariciMap.set(hs.id, hs);
    });

    // 1. Mevcut sınavları harici takvime göre senkronize et
    for (let i = VARSAYILAN_ETKINLIKLER.length - 1; i >= 0; i--) {
        const etk = VARSAYILAN_ETKINLIKLER[i];
        if (etk.kategori === 'sinav') {
            const harici = hariciMap.get(etk.id);
            if (harici) {
                // Oturum iptal edilmiş veya eksilmişse listeden çıkar
                if (harici.aktif === false) {
                    VARSAYILAN_ETKINLIKLER.splice(i, 1);
                    continue;
                }

                const hariciHedefZaman = new Date(harici.tarihStr).getTime();
                // Eğer harici takvimdeki tarih henüz geçmediyse bilgileri güncelle
                if (simdi.getTime() < hariciHedefZaman + 60000) {
                    etk.tarihStr = harici.tarihStr;
                    etk.resmi = harici.resmi === true;
                    etk.tahmini = !etk.resmi;
                    etk.kurum = harici.kurum || etk.kurum || 'ÖSYM';
                    if (harici.baslik) etk.baslik = harici.baslik;
                    if (harici.aciklama) etk.aciklama = harici.aciklama;
                    if (harici.ikon) etk.ikon = harici.ikon;
                }
            }
        }
    }

    // 2. Harici takvime yeni bir oturum eklendiyse (ör. YDS/3 veya ek oturum artışı) listeye dahil et
    hariciSinavlar.forEach(hs => {
        if (hs.aktif !== false) {
            const mevcutMu = VARSAYILAN_ETKINLIKLER.some(e => e.id === hs.id);
            if (!mevcutMu) {
                const yeniSinav = {
                    id: hs.id,
                    baslik: hs.baslik || 'Yeni Sınav Oturumu',
                    kategori: 'sinav',
                    kategoriAdi: hs.kategoriAdi || (hs.id.includes('yds') ? 'Dil Sınavı' : hs.id.includes('ales') ? 'Akademik Sınav' : 'Kamu Sınavı'),
                    rozetRenk: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
                    tarihStr: hs.tarihStr,
                    aciklama: hs.aciklama || 'Sınav oturumu.',
                    sabit: true,
                    ikon: hs.ikon || (hs.id.includes('yds') ? '🌐' : hs.id.includes('ales') ? '🎓' : '🏛️'),
                    tekrarTuru: 'sinav',
                    sinavTuru: hs.id.replace('etkinlik_', ''),
                    resmi: hs.resmi === true,
                    tahmini: hs.resmi !== true,
                    kurum: hs.kurum || 'ÖSYM'
                };
                VARSAYILAN_ETKINLIKLER.push(yeniSinav);
            }
        }
    });
}

// ==================== DURUM DEĞİŞKENLERİ ====================
let aktifKategori = 'tum'; // Şu anda seçili kategori (varsayılan: tümü)
let aramaMetni = '';        // Arama kutusundaki metin
let tumEtkinlikler = [];    // Tüm etkinlikleri (varsayılan + özel) tutan dizi
let sonKontrolGunu = new Date().getDate(); // Gün değişimi kontrolü için gün damgası

// ==================== TEMA YÖNETİMİ ====================
// Karanlık / Aydınlık mod: Kullanıcının tercihi localStorage'da saklanır.

/**
 * Sayfa ilk yüklendiğinde temayı başlatır.
 * localStorage'dan kaydedilmiş temayı okur, yoksa 'light' kullanır.
 */
function temaBaslat() {
    const kayitliTema = localStorage.getItem('yakala_zamani_tema') || 'light';
    temaUygula(kayitliTema);
}

/**
 * Belirtilen temayı uygular: HTML elementine 'dark' sınıfı ekler/çıkarır
 * ve güneş/ay ikonlarını uygun şekilde gösterir/gizler.
 */
function temaUygula(tema) {
    const html = document.documentElement; // <html> elementi
    const ikonGunes = document.getElementById('ikonGunes');
    const ikonAy = document.getElementById('ikonAy');

    if (tema === 'dark') {
        html.classList.add('dark');          // Karanlık mod sınıfı eklenir
        if (ikonGunes) ikonGunes.classList.remove('hidden'); // Güneş ikonu gösterilir (karanlık modda tıkla -> aydınlığa geç)
        if (ikonAy) ikonAy.classList.add('hidden');
    } else {
        html.classList.remove('dark');       // Karanlık mod sınıfı kaldırılır
        if (ikonGunes) ikonGunes.classList.add('hidden');
        if (ikonAy) ikonAy.classList.remove('hidden'); // Ay ikonu gösterilir (aydınlık modda tıkla -> karanlığa geç)
    }
    localStorage.setItem('yakala_zamani_tema', tema); // Tercih kaydedilir
}

/**
 * Tema değiştirme butonu tıklandığında çağrılır.
 * Mevcut temayı kontrol eder ve karşıtına geçiş yapar.
 */
function temaDegistir() {
    const aktifKaranlikMi = document.documentElement.classList.contains('dark');
    const yeniTema = aktifKaranlikMi ? 'light' : 'dark';
    temaUygula(yeniTema);
    toastGoster(yeniTema === 'dark' ? 'Karanlık mod devrede' : 'Aydınlık mod devrede', yeniTema === 'dark' ? '🌙' : '☀️');
}

// ==================== MOBİL MENÜ ====================
/**
 * Mobil ekranlarda kategori menüsünü açar/kapatır.
 * hidden sınıfını toggle ederek görünürlüğü değiştirir.
 */
function mobilMenuGecis() {
    const menu = document.getElementById('mobilMenuAlani');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// ==================== ETKİNLİK SIRALAMA ====================
/**
 * Etkinlikleri tarihlerine göre en yakından en uzağa sıralar.
 * Gelecekteki etkinlikler önce, geçmiş etkinlikler sonda listelenir.
 */
function etkinlikleriSirala(liste) {
    const simdi = Date.now(); // Şu anki zaman (milisaniye)
    return [...liste].sort((a, b) => {
        const zamanA = new Date(a.tarihStr).getTime();
        const zamanB = new Date(b.tarihStr).getTime();
        const farkA = simdi - zamanA;
        const farkB = simdi - zamanB;
        const aVaktiGeldi = farkA >= 0 && farkA < 60000;
        const bVaktiGeldi = farkB >= 0 && farkB < 60000;

        // Vakti gelmiş (1 dakikalık uyarı/kutlama modunda olan) etkinlik en başta çıksın
        if (aVaktiGeldi && !bVaktiGeldi) return -1;
        if (!aVaktiGeldi && bVaktiGeldi) return 1;

        const kalanA = zamanA - simdi;
        const kalanB = zamanB - simdi;

        // Her iki etkinlik de gelecekteyse: En yakın olan önce gelsin
        if (kalanA > 0 && kalanB > 0) {
            return zamanA - zamanB;
        }
        // Biri gelecekte biri geçmişteyse: Gelecekte olan öne çıksın
        if (kalanA > 0 && kalanB <= 0) return -1;
        if (kalanA <= 0 && kalanB > 0) return 1;
        // Her ikisi de geçmişteyse: En son tamamlanan önce gelsin
        return zamanB - zamanA;
    });
}

// ==================== ETKİNLİK YÜKLEME ====================
/**
 * Varsayılan etkinlikler ile kullanıcının eklediği özel etkinlikleri birleştirir,
 * sıralar ve tumEtkinlikler dizisine atar.
 * Özel etkinlikler localStorage'dan okunur.
 */
function etkinlikleriYukle() {
    try {
        const yerelVeri = localStorage.getItem('yakala_zamani_ozel_etkinlikler');
        const ozelEtkinlikler = yerelVeri ? JSON.parse(yerelVeri) : [];
        tumEtkinlikler = etkinlikleriSirala([...VARSAYILAN_ETKINLIKLER, ...ozelEtkinlikler]);
    } catch (hata) {
        // localStorage okunamadıysa sadece varsayılanları kullan
        tumEtkinlikler = etkinlikleriSirala([...VARSAYILAN_ETKINLIKLER]);
    }
}

// ==================== SAYFA SIFIRLAMA ====================
/**
 * Tüm filtreleri ve aramayı sıfırlayarak tüm etkinlikleri gösterir.
 * Ana Sayfa'ya dönmek için kullanılır.
 */
function sayfayiSifirla() {
    kategoriGoster('tum');
    const aramaInput = document.getElementById('aramaGirdisi');
    if (aramaInput) aramaInput.value = '';
    aramaMetni = '';
    etkinlikleriRenderEt();
}

// ==================== KATEGORİ FİLTRELEME ====================
/**
 * Seçilen kategoriye göre etkinlikleri filtreler.
 * Üst bardaki navigasyon butonlarının aktif/pasif stilini günceller.
 * Kategori başlığını değiştirir ve kartları yeniden render eder.
 */
function kategoriGoster(kategori) {
    aktifKategori = kategori;

    // Üst bar menü butonlarının aktifliğini güncelle
    document.querySelectorAll('.nav-ust-link').forEach(btn => {
        const navHedef = btn.getAttribute('data-nav');
        if (navHedef === kategori) {
            // Aktif buton stili: Koyu arka plan, beyaz yazı
            btn.className = 'nav-ust-link px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm';
        } else {
            // Pasif buton stili: Şeffaf arka plan, gri yazı
            btn.className = 'nav-ust-link px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800';
        }
    });

    // Kategori başlığını güncelle
    const baslikEl = document.getElementById('aktifKategoriBaslik');
    const isimler = {
        'tum': 'Tüm Etkinlikler',
        'milli': 'Milli Bayramlarımız',
        'onemli': 'Önemli Günler',
        'dini': 'Dini Bayramlarımız',
        'sinav': 'Sınavlar',
        'ozel': 'Özel Takip Listem'
    };
    if (baslikEl) {
        baslikEl.firstElementChild.innerText = isimler[kategori] || 'Etkinlikler';
    }

    etkinlikleriRenderEt(); // Kartları yeniden oluştur
}

// ==================== ETKİNLİK ARAMA ====================
/**
 * Arama kutusuna yazılan metne göre etkinlikleri filtreler.
 * Başlık ve açıklama alanlarında arama yapar.
 */
function etkinlikAra(kelime) {
    aramaMetni = kelime.trim().toLowerCase();
    etkinlikleriRenderEt();
}

// ==================== GERİ SAYIM HESAPLAMA ====================
/**
 * Verilen hedef tarihine kadar kalan süreyi hesaplar.
 * Sonucu gün, saat, dakika, saniye olarak döndürür.
 * Eğer tarih geçmişse tamamlandi: true döner.
 */
function geriSayimHesapla(hedefTarihStr, simdikiZamanMs = new Date().getTime()) {
    const hedefZaman = new Date(hedefTarihStr).getTime(); // Hedef tarihi milisaniyeye çevir
    const simdikiZaman = simdikiZamanMs;                   // Karşılaştırılan zaman (varsayılan: şu an)
    const fark = hedefZaman - simdikiZaman;                // Aradaki fark (milisaniye)

    // Eğer etkinlik vakti gelmişse veya geçmişse
    if (fark <= 0) {
        const gecenSure = simdikiZaman - hedefZaman;
        const vaktiGeldi = gecenSure >= 0 && gecenSure < 60000; // İlk 1 dakika boyunca büyüme/küçülme eylemi aktif

        return {
            tamamlandi: true,
            vaktiGeldi: vaktiGeldi, // 1 dakikalık uyarı ve kutlama durumu
            gun: '00',
            saat: '00',
            dakika: '00',
            saniye: '00',
            kalanMilisaniye: fark
        };
    }

    // Milisaniyeyi gün, saat, dakika ve saniyeye dönüştür
    const gun = Math.floor(fark / (1000 * 60 * 60 * 24));
    const saat = Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const dakika = Math.floor((fark % (1000 * 60 * 60)) / (1000 * 60));
    const saniye = Math.floor((fark % (1000 * 60)) / 1000);
    const pad = (num) => String(num).padStart(2, '0'); // Tek haneli sayıları iki haneli yap (ör: 5 -> 05)

    return {
        tamamlandi: false,
        vaktiGeldi: false,
        gun: pad(gun),
        saat: pad(saat),
        dakika: pad(dakika),
        saniye: pad(saniye),
        kalanMilisaniye: fark
    };
}

// ==================== TARİH BİÇİMLENDİRME ====================
/**
 * ISO tarih string'ini Türkçe tarih formatına dönüştürür.
 * Örnek: "2027-04-23T00:00:00" -> "23 Nisan 2027 • 00:00"
 */
function turkceTarihBicimlendir(tarihStr) {
    const d = new Date(tarihStr);
    const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const gun = d.getDate();
    const ay = aylar[d.getMonth()];
    const yil = d.getFullYear();
    const saat = String(d.getHours()).padStart(2, '0');
    const dakika = String(d.getMinutes()).padStart(2, '0');
    return `${gun} ${ay} ${yil} • ${saat}:${dakika}`;
}

// ==================== ETKİNLİK KARTLARINI OLUŞTURMA ====================
/**
 * Filtrelenmiş etkinlikleri HTML kartları olarak oluşturur ve DOM'a ekler.
 * Her kart: emoji ikon, kategori rozeti, başlık, tarih, açıklama ve geri sayım kutucukları içerir.
 * Hiç sonuç yoksa "Boş Sonuç" bildirimi gösterilir.
 */
function etkinlikleriRenderEt() {
    const konteyner = document.getElementById('etkinlikKartlariKonteyner');
    const bosSonuc = document.getElementById('bosSonucAlani');

    // Etkinlikleri kategori ve arama metnine göre filtrele
    const filtrelenmis = tumEtkinlikler.filter(etkinlik => {
        const kategoriUygun = (aktifKategori === 'tum') || (etkinlik.kategori === aktifKategori);
        const aramaUygun = !aramaMetni ||
            etkinlik.baslik.toLowerCase().includes(aramaMetni) ||
            etkinlik.aciklama.toLowerCase().includes(aramaMetni);
        return kategoriUygun && aramaUygun;
    });

    // Filtrelenmiş sonuçları tarihe göre sırala
    const siraliEtkinlikler = etkinlikleriSirala(filtrelenmis);

    // Hiç sonuç yoksa boş sonuç alanını göster
    if (siraliEtkinlikler.length === 0) {
        konteyner.innerHTML = '';
        bosSonuc.classList.remove('hidden');
        return;
    } else {
        bosSonuc.classList.add('hidden');
    }

    // Her etkinlik için dinamik HTML kart oluştur
    let html = '';
    siraliEtkinlikler.forEach(etk => {
        const rozetStil = etk.rozetRenk || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
        const silinebilirMi = !etk.sabit; // Sabit olmayan etkinlikler silinebilir

        let durumRozetiHtml = '';
        if (etk.kategori === 'sinav') {
            if (etk.resmi) {
                durumRozetiHtml = `
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40 inline-flex items-center gap-1 shrink-0" title="Resmi olarak açıklanmış kesin sınav tarihi">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Resmi Tarih (${etk.kurum || 'ÖSYM'})
                    </span>
                `;
            } else {
                durumRozetiHtml = `
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/40 inline-flex items-center gap-1 shrink-0" title="Resmi takvim henüz ilan edilmedi. Geçmiş verilerden analiz edilen tahmini tarihtir.">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Tahmini Tarih
                    </span>
                `;
            }
        }

        html += `
        <article class="glass-panel rounded-3xl p-6 flex flex-col justify-between relative group hover:border-slate-300 dark:hover:border-slate-700 transition duration-200 cursor-pointer" id="kart_${etk.id}" onclick="etkinlikDetayAc('${etk.id}')">
            <div class="flex items-start justify-between gap-3 mb-4">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-2xl" role="img" aria-label="İkon">${etk.ikon || '📅'}</span>
                    <span class="px-2.5 py-1 text-xs font-bold rounded-full ${rozetStil}">
                        ${etk.kategoriAdi || 'Etkinlik'}
                    </span>
                    ${durumRozetiHtml}
                </div>
                <div class="flex items-center gap-1">
                    <button onclick="event.stopPropagation(); etkinlikZamaniniKopyala('${etk.id}')" title="Kalan Süreyi Kopyala" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                        </svg>
                    </button>
                    ${silinebilirMi ? `
                        <button onclick="event.stopPropagation(); ozelEtkinlikSil('${etk.id}')" title="Sil" class="p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>

            <div class="mb-5 space-y-1">
                <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    ${etk.baslik}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    ${turkceTarihBicimlendir(etk.tarihStr)}
                </p>
                <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 pt-1 font-normal">
                    ${etk.aciklama}
                </p>
            </div>

            <div id="sayacKonteyner_${etk.id}" class="mt-auto pt-2">
                <div class="grid grid-cols-4 gap-2 text-center">
                    <div class="digit-box py-2.5 px-1 rounded-xl">
                        <span class="block text-xl font-black text-slate-900 dark:text-white sayac-gun">--</span>
                        <span class="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Gün</span>
                    </div>
                    <div class="digit-box py-2.5 px-1 rounded-xl">
                        <span class="block text-xl font-black text-slate-900 dark:text-white sayac-saat">--</span>
                        <span class="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Saat</span>
                    </div>
                    <div class="digit-box py-2.5 px-1 rounded-xl">
                        <span class="block text-xl font-black text-slate-900 dark:text-white sayac-dakika">--</span>
                        <span class="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Dakika</span>
                    </div>
                    <div class="digit-box py-2.5 px-1 rounded-xl">
                        <span class="block text-xl font-black text-slate-900 dark:text-white sayac-saniye">--</span>
                        <span class="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Saniye</span>
                    </div>
                </div>
            </div>
        </article>
        `;
    });

    konteyner.innerHTML = html;
    geriSayimlariGuncelle(); // Kartlar oluşturulduktan sonra sayaçları güncelle
}

// ==================== GERİ SAYIMLARI GÜNCELLEME ====================
/**
 * Tüm etkinliklerin geri sayımlarını günceller.
 * Ayrıca en yakın gelecekteki etkinliği bulur ve hero bölümünde gösterir.
 * Canlı sistem saatini de günceller.
 */
function geriSayimlariGuncelle() {
    const simdi = new Date();

    // 1 dakikalık büyüme/küçülme eylemi tamamlanan veya günü geçen etkinlikleri otomatik yenile
    const degisti = otomatikEtkinlikleriGuncelle(simdi);
    if (degisti) {
        sonKontrolGunu = simdi.getDate();
        etkinlikleriYukle();
        etkinlikleriRenderEt();
        return;
    }

    let enYakinEtkinlik = null;
    let enKucukFark = Infinity;
    let vaktiGelenHero = null;

    tumEtkinlikler.forEach(etk => {
        const sonuc = geriSayimHesapla(etk.tarihStr);

        // Vakti gelmiş (1 dakikalık uyarı/kutlama modunda) olan etkinliği Hero için önceliklendir
        if (sonuc.vaktiGeldi && !vaktiGelenHero) {
            vaktiGelenHero = etk;
        }

        // En yakın gelecekteki etkinliği bul (hero için)
        if (!sonuc.tamamlandi && sonuc.kalanMilisaniye < enKucukFark) {
            enKucukFark = sonuc.kalanMilisaniye;
            enYakinEtkinlik = etk;
        }

        // Her kartın sayacını ve 1 dakikalık animasyonunu güncelle
        const kartEl = document.getElementById(`kart_${etk.id}`);
        if (kartEl) {
            const konteyner = document.getElementById(`sayacKonteyner_${etk.id}`);
            if (sonuc.vaktiGeldi) {
                // Etkinliğin vakti geldiğinde kutu ve yazılar 1 dakika boyunca nazikçe büyüyüp küçülür
                kartEl.classList.add('vakit-geldi-animasyon');
                if (konteyner) {
                    konteyner.innerHTML = `
                        <div class="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-center vakit-geldi-rozet">
                            <span class="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5">
                                <span class="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                                🎉 Vakti Geldi! (Kutlanıyor)
                            </span>
                        </div>
                    `;
                }
            } else if (sonuc.tamamlandi) {
                // Eylem süresi tamamlandıktan sonra animasyon kaldırılır
                kartEl.classList.remove('vakit-geldi-animasyon');
                if (konteyner) {
                    konteyner.innerHTML = `
                        <div class="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center">
                            <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                Etkinlik gerçekleşti!
                            </span>
                        </div>
                    `;
                }
            } else {
                kartEl.classList.remove('vakit-geldi-animasyon');
                // Kart içindeki sayaç elementlerini güncelle
                const elGun = kartEl.querySelector('.sayac-gun');
                const elSaat = kartEl.querySelector('.sayac-saat');
                const elDakika = kartEl.querySelector('.sayac-dakika');
                const elSaniye = kartEl.querySelector('.sayac-saniye');

                if (elGun) elGun.innerText = sonuc.gun;
                if (elSaat) elSaat.innerText = sonuc.saat;
                if (elDakika) elDakika.innerText = sonuc.dakika;
                if (elSaniye) elSaniye.innerText = sonuc.saniye;
            }
        }
    });

    heroGeriSayiminiGuncelle(vaktiGelenHero || enYakinEtkinlik); // Hero bölümünü güncelle
    canliSistemSaatiniGuncelle();                // Saat göstergesini güncelle
}

// ==================== HERO GERİ SAYIMI ====================
/**
 * Sayfanın üst kısmındaki büyük hero kartını günceller.
 * En yakın gelecekteki etkinliğin başlığını, tarihini ve geri sayımını gösterir.
 * Vakti geldiğinde hero kutusu da yazısıyla birlikte 1 dakika boyunca büyüyüp küçülür.
 */
function heroGeriSayiminiGuncelle(etk) {
    const heroAlani = document.getElementById('heroVurguAlani');
    const baslikEl = document.getElementById('heroBaslik');
    const tarihEl = document.getElementById('heroTarih');
    const rozetMetin = document.getElementById('heroRozetMetin');
    const rozetKapsayici = document.getElementById('heroRozetKapsayici');
    const heroDurumRozeti = document.getElementById('heroDurumRozeti');
    const gunEl = document.getElementById('heroGun');
    const saatEl = document.getElementById('heroSaat');
    const dakikaEl = document.getElementById('heroDakika');
    const saniyeEl = document.getElementById('heroSaniye');

    // Hiç gelecek etkinlik yoksa
    if (!etk) {
        if (heroAlani) heroAlani.classList.remove('vakit-geldi-animasyon');
        if (rozetMetin) rozetMetin.innerText = "Tamamlandı";
        if (rozetKapsayici) rozetKapsayici.classList.remove('vakit-geldi-rozet');
        if (heroDurumRozeti) heroDurumRozeti.classList.add('hidden');
        if (baslikEl) baslikEl.innerText = "Tüm Etkinlikler Tamamlandı";
        if (tarihEl) tarihEl.innerText = "Yeni bir etkinlik ekleyebilirsiniz.";
        if (gunEl) gunEl.innerText = "00";
        if (saatEl) saatEl.innerText = "00";
        if (dakikaEl) dakikaEl.innerText = "00";
        if (saniyeEl) saniyeEl.innerText = "00";
        return;
    }

    const sonuc = geriSayimHesapla(etk.tarihStr);
    if (baslikEl) baslikEl.innerText = etk.baslik;
    if (tarihEl) tarihEl.innerText = turkceTarihBicimlendir(etk.tarihStr);

    // Hero sınav durum rozeti (Resmi / Tahmini)
    if (heroDurumRozeti) {
        if (etk.kategori === 'sinav') {
            heroDurumRozeti.classList.remove('hidden');
            if (etk.resmi) {
                heroDurumRozeti.className = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40';
                heroDurumRozeti.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Resmi Tarih (${etk.kurum || 'ÖSYM'})`;
            } else {
                heroDurumRozeti.className = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/40';
                heroDurumRozeti.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Tahmini Tarih`;
            }
        } else {
            heroDurumRozeti.classList.add('hidden');
        }
    }

    if (sonuc.vaktiGeldi) {
        // En üstteki etkinliğin bulunduğu kutu yazıyla birlikte 1 dakika boyunca büyüyüp küçülür
        if (heroAlani) heroAlani.classList.add('vakit-geldi-animasyon');
        if (rozetMetin) rozetMetin.innerText = "🎉 VAKTİ GELDİ!";
        if (rozetKapsayici) rozetKapsayici.classList.add('vakit-geldi-rozet');
        if (gunEl) gunEl.innerText = "00";
        if (saatEl) saatEl.innerText = "00";
        if (dakikaEl) dakikaEl.innerText = "00";
        if (saniyeEl) saniyeEl.innerText = "00";
    } else {
        if (heroAlani) heroAlani.classList.remove('vakit-geldi-animasyon');
        if (rozetMetin) rozetMetin.innerText = "Yaklaşıyor";
        if (rozetKapsayici) rozetKapsayici.classList.remove('vakit-geldi-rozet');
        if (gunEl) gunEl.innerText = sonuc.gun;
        if (saatEl) saatEl.innerText = sonuc.saat;
        if (dakikaEl) dakikaEl.innerText = sonuc.dakika;
        if (saniyeEl) saniyeEl.innerText = sonuc.saniye;
    }
}

// ==================== CANLI SİSTEM SAATİ ====================
/**
 * Header'daki canlı saat göstergesini günceller.
 * Saati SS:DD:SN formatında gösterir.
 */
function canliSistemSaatiniGuncelle() {
    const el = document.getElementById('canliSistemSaati');
    if (!el) return;
    const simdi = new Date();
    const saat = String(simdi.getHours()).padStart(2, '0');
    const dakika = String(simdi.getMinutes()).padStart(2, '0');
    const saniye = String(simdi.getSeconds()).padStart(2, '0');
    el.innerText = `${saat}:${dakika}:${saniye}`;
}

// ==================== KALAN SÜREYİ KOPYALAMA ====================
/**
 * Belirtilen etkinliğin kalan süresini panoya (clipboard) kopyalar.
 * Başarılı olursa toast bildirimi gösterir.
 */
function etkinlikZamaniniKopyala(etkinlikId) {
    const etk = tumEtkinlikler.find(e => e.id === etkinlikId);
    if (!etk) return;

    const sonuc = geriSayimHesapla(etk.tarihStr);
    let paylasimMetni = "";
    if (sonuc.tamamlandi) {
        paylasimMetni = `${etk.baslik} gerçekleşti!`;
    } else {
        paylasimMetni = `${etk.baslik} için kalan süre: ${sonuc.gun} Gün, ${sonuc.saat} Saat, ${sonuc.dakika} Dakika.`;
    }

    try {
        // Gizli bir textarea oluşturup metni kopyala
        const gizliTextarea = document.createElement('textarea');
        gizliTextarea.value = paylasimMetni;
        document.body.appendChild(gizliTextarea);
        gizliTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(gizliTextarea);
        toastGoster("Kalan süre panoya kopyalandı", "📋");
    } catch (err) {
        toastGoster("Kopyalanamadı", "⚠️");
    }
}

// ==================== TOAST BİLDİRİMLERİ ====================
/**
 * Ekranın sağ altında kısa süreli bildirim mesajı gösterir.
 * 2.5 saniye sonra otomatik kaybolur.
 */
let toastZamanlayici;
function toastGoster(mesaj, ikon = '✓') {
    const toast = document.getElementById('toastKutusu');
    const elIkon = document.getElementById('toastIkon');
    const elMesaj = document.getElementById('toastMesaj');
    if (!toast) return;

    elIkon.innerText = ikon;
    elMesaj.innerText = mesaj;

    // Toast'u göster (yukarı kaydır ve opak yap)
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    // 2.5 saniye sonra gizle
    clearTimeout(toastZamanlayici);
    toastZamanlayici = setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2500);
}

// ==================== MODAL YÖNETİMİ ====================
/**
 * Belirtilen ID'ye sahip modal penceresini açar.
 * Opacity ve scale animasyonları ile yumuşak açılış efekti.
 */
function modalAc(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        const icerik = modal.querySelector('div');
        if (icerik) icerik.classList.remove('scale-95');
    }
}

/**
 * Belirtilen ID'ye sahip modal penceresini kapatır.
 */
function modalKapat(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        const icerik = modal.querySelector('div');
        if (icerik) icerik.classList.add('scale-95');
    }
}

// ==================== YENİ ETKİNLİK KAYDETME ====================
/**
 * Modal formundaki verileri alır, yeni bir etkinlik objesi oluşturur,
 * localStorage'a kaydeder ve kartları yeniden render eder.
 */
function yeniEtkinlikKaydet(olay) {
    olay.preventDefault(); // Form'un sayfayı yenilemesini engelle

    // Form verilerini al
    const baslik = document.getElementById('yeniEtkinlikBaslik').value.trim();
    const kategori = document.getElementById('yeniEtkinlikKategori').value;
    const tarih = document.getElementById('yeniEtkinlikTarih').value;
    const saatEl = document.getElementById('yeniEtkinlikSaat');
    const dakikaEl = document.getElementById('yeniEtkinlikDakika');
    const saat = (saatEl && dakikaEl) ? `${saatEl.value}:${dakikaEl.value}` : (saatEl ? saatEl.value : '09:00');
    const aciklama = document.getElementById('yeniEtkinlikAciklama').value.trim() || 'Özel etkinlik';

    if (!baslik || !tarih) return; // Gerekli alanlar boşsa çık

    const tarihStr = `${tarih}T${saat}:00`;

    // Kategori bazlı ikon ve rozet renkleri
    const kategoriMap = {
        'ozel': { adi: 'Özel Etkinlik', rozet: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', ikon: '⭐' },
        'sinav': { adi: 'Sınav', rozet: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300', ikon: '📝' },
        'milli': {
            adi: 'Milli Bayram',
            rozet: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
            ikon: `<svg class="inline-block rounded-[3px] shadow-xs align-middle" style="width: 1.7em; height: 1.2em; vertical-align: -0.2em;" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#E30A17"/><circle cx="425" cy="400" r="200" fill="#ffffff"/><circle cx="475" cy="400" r="160" fill="#E30A17"/><polygon points="583.3,400 706.7,438.2 630.5,338.2 630.5,461.8 706.7,361.8" fill="#ffffff"/></svg>`
        },
        'dini': { adi: 'Dini Gün', rozet: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', ikon: '🌙' },
        'onemli': { adi: 'Önemli Gün', rozet: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300', ikon: '📌' }
    };

    // Yeni etkinlik objesi oluştur
    const yeniEtkinlik = {
        id: 'ozel_' + Date.now(), // Benzersiz ID (zaman damgası)
        baslik: baslik,
        kategori: kategori,
        kategoriAdi: (kategoriMap[kategori] || kategoriMap['ozel']).adi,
        rozetRenk: (kategoriMap[kategori] || kategoriMap['ozel']).rozet,
        tarihStr: tarihStr,
        aciklama: aciklama,
        sabit: false, // Özel etkinlikler silinebilir
        ikon: (kategoriMap[kategori] || kategoriMap['ozel']).ikon
    };

    // localStorage'a kaydet
    try {
        const yerelVeri = localStorage.getItem('yakala_zamani_ozel_etkinlikler');
        const ozelListe = yerelVeri ? JSON.parse(yerelVeri) : [];
        ozelListe.push(yeniEtkinlik);
        localStorage.setItem('yakala_zamani_ozel_etkinlikler', JSON.stringify(ozelListe));
    } catch (e) { }

    // Sayfa verilerini yenile
    etkinlikleriYukle();
    etkinlikleriRenderEt();
    modalKapat('modalYeniEtkinlik');
    document.getElementById('formYeniEtkinlik').reset();
    toastGoster('Yeni etkinlik başarıyla eklendi');
}

// ==================== ÖZEL ETKİNLİK SİLME ====================
/**
 * Kullanıcının eklediği özel bir etkinliği localStorage'dan siler
 * ve kartları yeniden render eder.
 */
function ozelEtkinlikSil(id) {
    try {
        const yerelVeri = localStorage.getItem('yakala_zamani_ozel_etkinlikler');
        if (yerelVeri) {
            const ozelListe = JSON.parse(yerelVeri).filter(e => e.id !== id);
            localStorage.setItem('yakala_zamani_ozel_etkinlikler', JSON.stringify(ozelListe));
        }
    } catch (e) { }
    etkinlikleriYukle();
    etkinlikleriRenderEt();
    toastGoster('Etkinlik silindi');
}

// ==================== SAYFA BAŞLATMA ====================
/**
 * Sayfa yüklendiğinde çalışan ana başlatma bloğu.
 * Tema, harici sınav takvimi verileri ve geri sayım döngüsünü başlatır.
 */
window.addEventListener('DOMContentLoaded', async function () {
    temaBaslat();                  // Temayı uygula
    await sinavTakviminiYukle();   // Harici resmi sınav takvimi varsa yükle ve oturumları senkronize et
    otomatikEtkinlikleriGuncelle(); // Günü geçmiş milli, önemli, dini ve sınav etkinliklerini otomatik bir sonraki yıla/tarihe taşı
    etkinlikleriYukle();           // Etkinlikleri yükle
    etkinlikleriRenderEt();        // Kartları oluştur

    // Her 1 saniyede bir geri sayımları güncelle
    setInterval(geriSayimlariGuncelle, 1000);

    // Tarih seçicinin minimum değerini bugüne ayarla
    const tarihSecici = document.getElementById('yeniEtkinlikTarih');
    if (tarihSecici) {
        const bugun = new Date().toISOString().split('T')[0];
        tarihSecici.min = bugun;
        tarihSecici.value = bugun;
    }
});

// ==================== ETKİNLİK DETAY MODALI ====================
// Detay modalı için şu an açık olan etkinliği tutan değişken.
let detayAcikEtkinlikId = null;
let detaySayacInterval = null;

/**
 * Bir etkinlik kartına tıklandığında detay modalını açar.
 * Modal içinde etkinliğin adı, tarihi, açıklaması ve büyük geri sayım kutucuğu gösterilir.
 * Sayım her saniye canlı olarak güncellenir.
 */
function etkinlikDetayAc(etkinlikId) {
    const etk = tumEtkinlikler.find(e => e.id === etkinlikId);
    if (!etk) return;

    detayAcikEtkinlikId = etkinlikId;

    // Modal içerisindeki elementleri güncelle
    const ikonEl = document.getElementById('detayIkon');
    const rozetEl = document.getElementById('detayRozet');
    const durumRozetiEl = document.getElementById('detayDurumRozeti');
    const durumKutusuEl = document.getElementById('detayDurumKutusu');
    const baslikEl = document.getElementById('detayBaslik');
    const tarihEl = document.getElementById('detayTarih');
    const aciklamaEl = document.getElementById('detayAciklama');
    const kopyalaBtn = document.getElementById('detayKopyalaBtn');

    if (ikonEl) ikonEl.innerHTML = etk.ikon || '📅';
    if (rozetEl) {
        rozetEl.innerText = etk.kategoriAdi || 'Etkinlik';
        rozetEl.className = `px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${etk.rozetRenk || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`;
    }

    // Sınav durum rozeti ve bilgilendirme kutusu (Resmi / Tahmini)
    if (etk.kategori === 'sinav') {
        if (durumRozetiEl) {
            durumRozetiEl.innerHTML = etk.resmi
                ? `<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40 inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Resmi Tarih (${etk.kurum || 'ÖSYM'})</span>`
                : `<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/40 inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>Tahmini Tarih</span>`;
        }
        if (durumKutusuEl) {
            durumKutusuEl.classList.remove('hidden');
            if (etk.resmi) {
                durumKutusuEl.innerHTML = `
                    <div class="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-2.5">
                        <span class="text-base leading-none">✅</span>
                        <div>
                            <strong class="font-bold">Resmi Sınav Tarihi:</strong> Bu tarih ${etk.kurum || 'ÖSYM'} tarafından resmi olarak ilan edilmiş kesin sınav takvimidir. Sınav günü tamamlandıktan sonra sistem otomatik olarak bir sonraki yılın tahmini tarih döngüsüne geçecektir.
                        </div>
                    </div>
                `;
            } else {
                durumKutusuEl.innerHTML = `
                    <div class="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                        <span class="text-base leading-none">⏳</span>
                        <div>
                            <strong class="font-bold">Tahmini Sınav Tarihi:</strong> ${etk.kurum || 'ÖSYM'} henüz resmi sınav takvimini yayımlamamıştır. Bu tarih, kurumun geçmiş yıllardaki takvim gelenekleri analiz edilerek matematiksel olarak tahmin edilmiştir. Resmi takvim ilan edildiğinde otomatik olarak kesin tarihe güncellenecektir.
                        </div>
                    </div>
                `;
            }
        }
    } else {
        if (durumRozetiEl) durumRozetiEl.innerHTML = '';
        if (durumKutusuEl) durumKutusuEl.classList.add('hidden');
    }

    if (baslikEl) baslikEl.innerText = etk.baslik;
    if (tarihEl) tarihEl.innerText = turkceTarihBicimlendir(etk.tarihStr);
    if (aciklamaEl) aciklamaEl.innerText = etk.aciklama;

    // Kopyala butonuna etkinlik ID'sini bağla
    if (kopyalaBtn) {
        kopyalaBtn.onclick = function () {
            etkinlikZamaniniKopyala(etkinlikId);
        };
    }

    // Geri sayımı hemen güncelle
    detaySayaciniGuncelle();

    // Modal açıkken her saniye sayımı güncelle
    if (detaySayacInterval) clearInterval(detaySayacInterval);
    detaySayacInterval = setInterval(detaySayaciniGuncelle, 1000);

    // Modalı aç
    modalAc('modalEtkinlikDetay');
}

/**
 * Detay modalındaki geri sayım kutucuğunu günceller.
 * Etkinlik geçmişse "Etkinlik gerçekleşti!" mesajı gösterir.
 */
function detaySayaciniGuncelle() {
    if (!detayAcikEtkinlikId) return;

    const etk = tumEtkinlikler.find(e => e.id === detayAcikEtkinlikId);
    if (!etk) return;

    const sonuc = geriSayimHesapla(etk.tarihStr);
    const sayacAlani = document.getElementById('detaySayacAlani');

    const modalPencere = document.querySelector('#modalEtkinlikDetay .glass-panel');

    if (sonuc.vaktiGeldi) {
        // Modal penceresi de 1 dakika boyunca büyüyüp küçülür
        if (modalPencere) modalPencere.classList.add('vakit-geldi-animasyon');
        if (sayacAlani) {
            sayacAlani.innerHTML = `
                <div class="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-center vakit-geldi-rozet">
                    <span class="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-2">
                        <span class="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                        🎉 Vakti Geldi! (Kutlanıyor)
                    </span>
                </div>
            `;
        }
    } else if (sonuc.tamamlandi) {
        if (modalPencere) modalPencere.classList.remove('vakit-geldi-animasyon');
        // Etkinlik geçmişse
        if (sayacAlani) {
            sayacAlani.innerHTML = `
                <div class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center">
                    <span class="text-base font-bold text-emerald-700 dark:text-emerald-400">
                        ✅ Etkinlik gerçekleşti!
                    </span>
                </div>
            `;
        }
    } else {
        if (modalPencere) modalPencere.classList.remove('vakit-geldi-animasyon');
        const gunEl = document.getElementById('detayGun');
        const saatEl = document.getElementById('detaySaat');
        const dakikaEl = document.getElementById('detayDakika');
        const saniyeEl = document.getElementById('detaySaniye');

        if (gunEl) gunEl.innerText = sonuc.gun;
        if (saatEl) saatEl.innerText = sonuc.saat;
        if (dakikaEl) dakikaEl.innerText = sonuc.dakika;
        if (saniyeEl) saniyeEl.innerText = sonuc.saniye;
    }
}

// Modal kapandığında detay sayıcını durdur.
// Mevcut modalKapat fonksiyonunu genişleterek detay modalı için ek temizlik yapıyoruz.
const orijinalModalKapat = modalKapat;
modalKapat = function (modalId) {
    orijinalModalKapat(modalId);
    if (modalId === 'modalEtkinlikDetay') {
        detayAcikEtkinlikId = null;
        if (detaySayacInterval) {
            clearInterval(detaySayacInterval);
            detaySayacInterval = null;
        }
    }
};