// src/pages/EventSettingsPage.jsx
import React, { useState } from 'react';
import Button from '../components/Button';
import { Settings, Save, Bell, Tag, ShieldCheck } from 'lucide-react';

// Komponen Form Item Sederhana
const FormItem = ({ label, children, htmlFor, description }) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
    <dt className="text-sm font-medium text-brand-dark">
      <label htmlFor={htmlFor}>{label}</label>
      {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
    </dt>
    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      {children}
    </dd>
  </div>
);

// Komponen Switch Toggle Sederhana
const ToggleSwitch = ({ id, checked, onChange, label }) => (
  <div className="flex items-center">
    <button
      type="button"
      className={`${
        checked ? 'bg-brand-action' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-action focus:ring-offset-2`}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      id={id}
    >
      <span
        aria-hidden="true"
        className={`${
          checked ? 'translate-x-5' : 'translate-x-0'
        } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
    {label && <span className="ml-3 text-sm text-brand-dark">{label}</span>}
  </div>
);


function EventSettingsPage() {
  // Contoh state untuk pengaturan
  const [defaultNotification, setDefaultNotification] = useState(true);
  const [maxUpcomingEvents, setMaxUpcomingEvents] = useState(5);
  const [autoArchiveDays, setAutoArchiveDays] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    // Simulasi penyimpanan ke backend
    console.log("Menyimpan pengaturan:", { defaultNotification, maxUpcomingEvents, autoArchiveDays });
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Pengaturan berhasil disimpan!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-bg py-8"> {/* Latar: #EAEFEF */}
      <div className="container mx-auto px-4 sm:px-6">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brand-dark flex items-center">
            <Settings size={36} className="mr-3 text-brand-medium" /> Pengaturan Event Global
          </h1>
          <p className="mt-1 text-gray-600">Konfigurasi pengaturan umum untuk manajemen event di platform ini.</p>
        </header>

        {successMessage && 
            <div className="mb-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                {successMessage}
            </div>
        }

        <form onSubmit={handleSaveChanges}>
          <div className="bg-white shadow-custom-strong rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-200">
              {/* Bagian Notifikasi */}
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold leading-6 text-brand-dark flex items-center">
                  <Bell size={20} className="mr-2 text-brand-action" /> Notifikasi Default
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Atur preferensi notifikasi default untuk event baru yang dibuat.</p>
                </div>
                <div className="mt-5">
                    <FormItem htmlFor="defaultNotification" label="Notifikasi Email ke Partisipan">
                        <ToggleSwitch id="defaultNotification" checked={defaultNotification} onChange={setDefaultNotification} />
                    </FormItem>
                </div>
              </div>

              {/* Bagian Tampilan Event */}
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold leading-6 text-brand-dark flex items-center">
                  <Tag size={20} className="mr-2 text-brand-action" /> Tampilan & Kategori
                </h3>
                 <div className="mt-5 space-y-4">
                    <FormItem htmlFor="maxUpcomingEvents" label="Maks Event Ditampilkan (Beranda)" description="Jumlah maksimum event 'akan datang' yang ditampilkan di beranda.">
                        <input
                            type="number"
                            name="maxUpcomingEvents"
                            id="maxUpcomingEvents"
                            value={maxUpcomingEvents}
                            onChange={(e) => setMaxUpcomingEvents(Number(e.target.value))}
                            className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-brand-action focus:ring-brand-action sm:text-sm px-3 py-2"
                            min="1"
                            max="20"
                        />
                    </FormItem>
                    {/* Tambahkan pengaturan lain di sini, misal: kategori default, dll. */}
                 </div>
              </div>

              {/* Bagian Keamanan & Arsip */}
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold leading-6 text-brand-dark flex items-center">
                  <ShieldCheck size={20} className="mr-2 text-brand-action" /> Keamanan & Arsip
                </h3>
                 <div className="mt-5 space-y-4">
                    <FormItem htmlFor="autoArchiveDays" label="Arsipkan Event Otomatis (Hari)" description="Event akan diarsipkan otomatis setelah X hari dari tanggal selesai.">
                        <input
                            type="number"
                            name="autoArchiveDays"
                            id="autoArchiveDays"
                            value={autoArchiveDays}
                            onChange={(e) => setAutoArchiveDays(Number(e.target.value))}
                             className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-brand-action focus:ring-brand-action sm:text-sm px-3 py-2"
                            min="7"
                            max="365"
                        />
                    </FormItem>
                    {/* Tambahkan pengaturan lain, misal: moderasi konten, dll. */}
                 </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 text-right">
              <Button type="submit" variant="primary" disabled={isLoading}>
                <Save size={18} className="inline mr-2" /> {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventSettingsPage;