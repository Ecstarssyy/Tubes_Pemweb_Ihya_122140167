// src/pages/ParticipantsPage.jsx
import React, { useState, useEffect } from 'react';
import AddEditParticipantForm from '../components/AddEditParticipantForm'; //
import { ParticipantService } from '../services/participantService';
import ErrorMessage from '../components/ErrorMessage'; //
import LoadingSpinner from '../components/LoadingSpinner'; //
import Button from '../components/Button';
import { UserPlus, Edit, Trash, RefreshCw } from 'lucide-react';

function ParticipantsPage({ eventId, onLogout }) { // eventId sekarang diterima sebagai prop
  const [participants, setParticipants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin'; // Pastikan role ini konsisten

  const fetchEventParticipants = async () => {
    if (!eventId) {
        setError("Event ID tidak ditemukan.");
        setLoading(false);
        return;
    }
    setLoading(true);
    setError(null);
    try {
      let data = await ParticipantService.getEventParticipants(eventId);
      // Backend sekarang mengembalikan { "participants": [...] }
      // Jika service Anda mentransformasi ini, pastikan konsisten.
      // Kita asumsikan ParticipantService.getEventParticipants mengembalikan array.
      // Atau jika mengembalikan object: data = data.participants || [];
      
      // Jika ParticipantService.getEventParticipants mengembalikan objek seperti { participants: [...] }
      // maka:
      data = data.participants || [];


      if (!isAdmin && user) {
        // Filter hanya partisipan dengan email user yang login jika bukan admin
        data = data.filter(p => p.email === user.email);
      }
      setParticipants(data);
    } catch (err) {
      setError('Gagal memuat partisipan. Silakan coba lagi.');
      console.error('Error fetching participants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventParticipants();
  }, [eventId, isAdmin, user?.email]); // Tambahkan dependency yang relevan

  const handleAddClick = () => { setEditingParticipant(null); setShowForm(true); };
  const handleEditClick = (participant) => { setEditingParticipant(participant); setShowForm(true); };

  const handleDeleteClick = async (participantId) => {
    if (!isAdmin) return;
    if (window.confirm('Apakah Anda yakin ingin menghapus partisipan ini?')) {
      setActionLoading(true);
      try {
        await ParticipantService.deleteParticipant(eventId, participantId);
        setParticipants(prev => prev.filter(p => p.id !== participantId));
      } catch (err) {
        setError(err.message || 'Gagal menghapus partisipan.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSave = async (participantData) => {
    if (!isAdmin && !editingParticipant) { // Hanya admin yang bisa menambah baru atau mengedit
        // User biasa mungkin bisa mengedit data dirinya sendiri jika editingParticipant.id === user.participant_id
        // Logika ini perlu disesuaikan tergantung kebutuhan
        setError("Hanya admin yang dapat melakukan aksi ini.");
        return;
    }
    setActionLoading(true);
    try {
      if (editingParticipant) {
        const updated = await ParticipantService.updateParticipant(eventId, editingParticipant.id, participantData);
        setParticipants(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      } else {
        const newParticipant = await ParticipantService.createParticipant(eventId, participantData);
        setParticipants(prev => [...prev, newParticipant]);
      }
      setShowForm(false);
      setEditingParticipant(null);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan partisipan.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => { setShowForm(false); setEditingParticipant(null); };

  return (
    <div className="min-h-screen bg-brand-bg py-8"> {/* Latar: #EAEFEF */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* Navbar sudah ada di App.jsx, jadi tidak perlu di sini lagi jika ParticipantsPage adalah route child */}
        {/* <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-brand-dark">Manajemen Partisipan</h1>
          <Button onClick={onLogout} variant="secondary" size="sm">Logout</Button>
        </header> */}
        {/* Hapus header di atas jika Navbar sudah global */}
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brand-dark mb-8">
            Manajemen Partisipan untuk Event ID: {eventId}
        </h1>


        {error && <div className="mb-6"><ErrorMessage message={error} onClose={() => setError(null)} /></div>}

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-xl shadow-custom-light">
          <div>
            {isAdmin && !showForm && (
              <Button variant="primary" onClick={handleAddClick} disabled={actionLoading || loading}>
                <UserPlus size={18} className="inline mr-2"/> Tambah Partisipan
              </Button>
            )}
          </div>
          <Button variant="light" onClick={fetchEventParticipants} disabled={loading || actionLoading} className="text-brand-dark">
            <RefreshCw size={16} className={`inline mr-2 ${loading ? 'animate-spin' : ''}`}/> Muat Ulang Daftar
          </Button>
        </div>

        {showForm && (isAdmin || editingParticipant) && ( // Hanya tampilkan form jika admin ATAU sedang mengedit partisipan (untuk user edit data diri)
          <div className="mb-8 p-6 bg-white rounded-xl shadow-custom-strong">
            <h2 className="text-2xl font-semibold font-heading text-brand-dark mb-4">
              {editingParticipant ? 'Edit Partisipan' : 'Tambah Partisipan Baru'}
            </h2>
            <AddEditParticipantForm
              eventId={eventId} // Kirim eventId ke form
              participant={editingParticipant}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-xl shadow-custom-strong overflow-x-auto">
            <table className="w-full min-w-max text-sm text-left text-brand-dark">
              <thead className="bg-brand-light bg-opacity-50 text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">Nama</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Telepon</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Status Kehadiran</th>
                  {(isAdmin || (participants.length > 0 && participants.some(p => p.email === user?.email))) && 
                    <th scope="col" className="px-6 py-3 font-semibold text-center">Aksi</th>
                  }
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="text-center py-10 text-gray-500">
                      Tidak ada partisipan yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  participants.map((p) => (
                    <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium whitespace-nowrap">{p.name}</td>
                      <td className="px-6 py-4">{p.email}</td>
                      <td className="px-6 py-4">{p.phone || '-'}</td>
                      <td className="px-6 py-4">{p.attendanceStatus || 'Belum Dikonfirmasi'}</td>
                      {(isAdmin || p.email === user?.email) && ( // User hanya bisa lihat aksi untuk dirinya sendiri jika bukan admin
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center space-x-2">
                            {/* User biasa mungkin hanya bisa edit data dirinya, bukan delete */}
                            {(isAdmin || (p.email === user?.email && editingParticipant?.id !== p.id)) && // User bisa edit diri sendiri
                                <Button onClick={() => handleEditClick(p)} variant="light" size="sm" className="!p-1.5" disabled={actionLoading}>
                                    <Edit size={16} />
                                </Button>
                            }
                            {isAdmin && // Hanya admin yang bisa delete
                                <Button onClick={() => handleDeleteClick(p.id)} variant="light" size="sm" className="!p-1.5 hover:!bg-red-100 hover:!text-red-600" disabled={actionLoading}>
                                    <Trash size={16} />
                                </Button>
                            }
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticipantsPage;