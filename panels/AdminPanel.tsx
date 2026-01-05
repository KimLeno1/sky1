
import React, { useState, useEffect } from 'react';
import { transactionService, TransactionRecord } from '../services/transactionService.ts';
import { authService, User } from '../services/authService.ts';
import { cardDatabase } from '../services/cardDatabase.ts';
import { SavedCard } from '../types.ts';
import { Button } from '../components/Button.tsx';
import { Icons } from '../constants.tsx';

interface AdminPanelProps {
  onExit: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExit }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [txns, setTxns] = useState<TransactionRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [activeTab, setActiveTab] = useState<'TX' | 'USERS' | 'CARDS'>('TX');

  useEffect(() => {
    if (isAdminAuthenticated) {
      setTxns(transactionService.getTransactions());
      setUsers(authService.getUsers());
      setCards(cardDatabase.getCards());
    }
  }, [isAdminAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'lenoakowan@gmail.com' && adminPass === '1234') {
      setIsAdminAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const totalRevenue = txns.reduce((sum, t) => sum + t.amount, 0);

  const clearTransactions = () => {
    if (confirm("Clear all transactions? This action is irreversible.")) {
      transactionService.clearHistory();
      setTxns([]);
    }
  };

  const clearCards = () => {
    if (confirm("Clear all vaulted cards? This will purge all user payment methods.")) {
      cardDatabase.clearVault();
      setCards([]);
    }
  };

  const downloadFile = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportVaultAsTxt = () => {
    const data = cardDatabase.getCards();
    let content = `SKYNET SECURE VAULT EXPORT - ${new Date().toLocaleString()}\n`;
    content += `TOTAL RECORDS: ${data.length}\n`;
    content += `--------------------------------------------------\n\n`;

    data.forEach((card, index) => {
      content += `RECORD #${index + 1}\n`;
      content += `CARD ID:   ${card.id}\n`;
      content += `HOLDER:    ${card.cardholderName.toUpperCase()}\n`;
      content += `NUMBER:    ${card.cardNumber}\n`;
      content += `EXPIRY:    ${card.expiry}\n`;
      content += `CVV:       ${card.cvv}\n`;
      content += `TYPE:      ${card.cardType}\n`;
      content += `--------------------------------------------------\n`;
    });

    downloadFile(content, `skynet_master_vault_${Date.now()}.txt`);
  };

  const exportTransactionsAsTxt = () => {
    const data = transactionService.getTransactions();
    let content = `SKYNET TRANSACTION LOG EXPORT - ${new Date().toLocaleString()}\n`;
    content += `TOTAL REVENUE: $${totalRevenue.toLocaleString()}\n`;
    content += `TOTAL TXNS:    ${data.length}\n`;
    content += `--------------------------------------------------\n\n`;

    data.forEach((tx, index) => {
      content += `TRANSACTION #${index + 1}\n`;
      content += `TX ID:      ${tx.id}\n`;
      content += `TIMESTAMP:  ${tx.timestamp}\n`;
      content += `ROUTE:      ${tx.route}\n`;
      content += `AMOUNT:     $${tx.amount}\n`;
      content += `CARDHOLDER: ${tx.cardholderName.toUpperCase()}\n`;
      content += `CARD TYPE:  ${tx.cardType}\n`;
      content += `CARD NUM:   ${tx.cardNumber}\n`;
      content += `EXPIRY:     ${tx.expiry}\n`;
      content += `CVV:        ${tx.cvv}\n`;
      content += `--------------------------------------------------\n`;
    });

    downloadFile(content, `skynet_transaction_logs_${Date.now()}.txt`);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[32px] md:rounded-[48px] shadow-2xl space-y-6 md:space-y-8 animate-in zoom-in-95 duration-500">
          <div className="text-center space-y-4">
            <div className={`w-16 h-16 md:w-20 md:h-20 bg-blue-600/20 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl border border-blue-500/30 transition-all ${loginError ? 'bg-red-500/20 text-red-500' : ''}`}>
              <Icons.Shield />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Admin Entry</h1>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identifier</label>
              <input 
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-white transition-all"
                placeholder="EMAIL"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Code</label>
              <input 
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-white transition-all"
                placeholder="••••"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
              />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Button type="submit" size="lg" className="w-full">
                ACCESS
              </Button>
              <button 
                type="button"
                onClick={onExit}
                className="text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Return
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 md:pb-8 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">Console</h1>
            <p className="text-slate-500 font-mono text-[10px] md:text-xs mt-2 tracking-widest uppercase">
              Admin: <span className="text-blue-400">{adminEmail}</span>
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" onClick={onExit} className="flex-1 border-blue-500 text-blue-500">
              EXIT
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-[32px] space-y-1">
            <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue</p>
            <p className="text-xl md:text-3xl font-black text-emerald-500">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-[32px] space-y-1">
            <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Trips</p>
            <p className="text-xl md:text-3xl font-black text-blue-500">{txns.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-[32px] space-y-1">
            <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Users</p>
            <p className="text-xl md:text-3xl font-black text-white">{users.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-[32px] space-y-1">
            <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Vault</p>
            <p className="text-xl md:text-3xl font-black text-amber-500">{cards.length}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button onClick={() => setActiveTab('TX')} className={`flex-1 py-3 md:py-4 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TX' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>TXNS</button>
          <button onClick={() => setActiveTab('USERS')} className={`flex-1 py-3 md:py-4 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'USERS' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>USERS</button>
          <button onClick={() => setActiveTab('CARDS')} className={`flex-1 py-3 md:py-4 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CARDS' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>VAULT</button>
        </div>

        {/* Mobile-friendly Data View */}
        <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-[48px] overflow-hidden shadow-2xl">
          <div className="p-4 md:p-8">
            {activeTab === 'TX' && (
              <div className="space-y-4">
                {txns.length === 0 ? (
                  <p className="py-12 text-center text-[10px] font-black text-slate-600 uppercase">No Data</p>
                ) : (
                  txns.map(t => (
                    <div key={t.id} className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-blue-400 font-mono text-[10px]">{t.id}</span>
                        <span className="text-emerald-500 font-black text-xs">${t.amount}</span>
                      </div>
                      <p className="text-white text-[10px] font-black uppercase">{t.route}</p>
                      <div className="flex justify-between items-end text-[9px] text-slate-500 uppercase">
                        <span>{t.cardholderName}</span>
                        <span>{new Date(t.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'USERS' && (
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="py-12 text-center text-[10px] font-black text-slate-600 uppercase">No Data</p>
                ) : (
                  users.map(u => (
                    <div key={u.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-white text-[10px] font-black uppercase">{u.firstName} {u.lastName}</p>
                        <p className="text-slate-500 text-[9px] font-mono lowercase">{u.email}</p>
                      </div>
                      <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded uppercase">{u.memberStatus}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'CARDS' && (
              <div className="space-y-4">
                {cards.length === 0 ? (
                  <p className="py-12 text-center text-[10px] font-black text-slate-600 uppercase">No Data</p>
                ) : (
                  cards.map(c => (
                    <div key={c.id} className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                      <p className="text-white font-mono text-xs tracking-widest">{c.cardNumber}</p>
                      <div className="flex justify-between text-[9px] text-slate-500 uppercase">
                        <span>{c.cardholderName}</span>
                        <span className="text-blue-400 font-black">{c.cardType}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          {activeTab === 'TX' && txns.length > 0 && (
            <Button size="md" onClick={exportTransactionsAsTxt} className="w-full bg-emerald-600">DOWNLOAD LOGS</Button>
          )}
          {activeTab === 'CARDS' && cards.length > 0 && (
            <Button size="md" onClick={exportVaultAsTxt} className="w-full bg-emerald-600">DOWNLOAD VAULT</Button>
          )}
          <Button variant="outline" size="md" onClick={clearTransactions} className="w-full border-red-900/40 text-red-500">WIPE ALL</Button>
        </div>
      </div>
    </div>
  );
};
