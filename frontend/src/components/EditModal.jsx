const EditModal = ({ isOpen, onClose, onSave }) => {
  //   if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg p-6 relative">
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
        >
          ✕
        </button>

        {/* Başlık */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Bilgileri Düzenle
        </h2>

        {/* Form Alanı */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-600 mb-1">Ad</label>
            <input
              type="text"
              placeholder="Adınızı girin"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="ornek@eposta.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Kaydet Butonu */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-gray-600 hover:text-red-500 transition"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
