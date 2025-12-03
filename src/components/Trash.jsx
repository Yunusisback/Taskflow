import { X, RotateCcw, Trash2, Layout, FileText } from "lucide-react";

const Trash = ({ isOpen, onClose, trashItems, restoreItem, deletePermanently }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Arka Plan */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Kayar Panel */}
      <div className="relative w-full max-w-md h-full bg-neutral-900/95 border-l border-neutral-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Başlık Kısmı */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-500">
            <Trash2 size={24} />
            <h2 className="text-xl font-bold text-white">Çöp Kutusu</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Liste Kısmı */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {trashItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-4">
              <Trash2 size={48} className="opacity-20" />
              <p>Çöp kutusu boş</p>
            </div>
          ) : (
            trashItems.map((item) => (
              <div 
                key={item.deletedAt} 
                className="group p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-xl hover:border-rose-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/*  Sütun mu görev mi? */}
                    <div className={`p-2 rounded-lg ${item.type === 'column' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {item.type === 'column' ? <Layout size={18} /> : <FileText size={18} />}
                    </div>
                    
                    <div>
                      <p className="font-medium text-neutral-200 line-clamp-1">
                        {item.type === 'column' ? item.title : item.content}
                      </p>
                      <span className="text-xs text-neutral-500">
                         {item.type === 'column' ? 'Sütun' : 'Görev'} • {new Date(item.deletedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => restoreItem(item)}
                      title="Geri Yükle"
                      className="p-2 rounded-lg bg-neutral-700/50 hover:bg-emerald-500/20 text-neutral-400 hover:text-emerald-400 transition-colors"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button 
                      onClick={() => deletePermanently(item.deletedAt)}
                      title="Kalıcı Olarak Sil"
                      className="p-2 rounded-lg bg-neutral-700/50 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 text-center text-xs text-neutral-500">
          Otomatik silme kapalı
        </div>
      </div>
    </div>
  );
};

export default Trash;