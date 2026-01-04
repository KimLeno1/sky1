
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[48px] shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
          <div className="text-center space-y-4">
            <div className={`w-20 h-20 bg-blue-600/20 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl border border-blue-500/30 transition-all ${loginError ? 'bg-red-500/20 text-red-500 border-red-500/50 animate-bounce' : ''}`}>
              <Icons.Shield />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Security Clearance</h1>
            <p className="text-slate-500 font-mono text-[10px] tracking-[0.3em] uppercase">SkyNet Command Center Access</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Admin Identifier</label>
              <input 
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-white transition-all"
                placeholder="EMAIL ADDRESS"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Access Code</label>
              <input 
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-white transition-all"
                placeholder="••••"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
              />
            </div>

            {loginError && (
              <p className="text-[10px] font-black text-red-500 text-center uppercase tracking-widest animate-pulse">
                Invalid Credentials. Entry Logged.
              </p>
            )}

            <div className="pt-4 flex flex-col gap-4">
              <Button type="submit" size="xl" className="w-full shadow-2xl shadow-blue-500/20">
                INITIATE PROTOCOL
              </Button>
              <button 
                type="button"
                onClick={onExit}
                className="text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Abort & Return Home
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-12 font-sans animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">SkyNet <span className="text-blue-500">Master Console</span></h1>
            <p className="text-slate-500 font-mono text-xs mt-2 tracking-widest">
              LOGGED IN AS: <span className="text-blue-400 font-bold">{adminEmail}</span> | SESSION: OMEGA-SECURE
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => setIsAdminAuthenticated(false)} className="text-slate-500 hover:text-white">
              LOGOUT
            </Button>
            <Button variant="outline" onClick={onExit} className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
              EXIT ADMIN MODE
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-2 group hover:bg-white/10 transition-all">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gross Revenue</p>
            <p className="text-4xl font-black text-emerald-500 tracking-tighter">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-2 group hover:bg-white/10 transition-all">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Bookings</p>
            <p className="text-4xl font-black text-blue-500 tracking-tighter">{txns.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-2 group hover:bg-white/10 transition-all">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Users</p>
            <p className="text-4xl font-black text-white tracking-tighter">{users.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-2 group hover:bg-white/10 transition-all">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Card Vault</p>
            <p className="text-4xl font-black text-amber-500 tracking-tighter">{cards.length}</p>
          </div>
        </div>

        {/* Data View */}
        <div className="bg-white/5 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/10 p-4 bg-white/5">
            <div className="flex overflow-x-auto">
              <button 
                onClick={() => setActiveTab('TX')}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'TX' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                Transactions
              </button>
              <button 
                onClick={() => setActiveTab('USERS')}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'USERS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                User Accounts
              </button>
              <button 
                onClick={() => setActiveTab('CARDS')}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'CARDS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                Master Card Vault
              </button>
            </div>
            
            <div className="flex gap-2">
              {activeTab === 'TX' && (
                <Button size="sm" onClick={exportTransactionsAsTxt} className="bg-emerald-600 hover:bg-emerald-700">
                  EXPORT LOGS (.TXT)
                </Button>
              )}
              {activeTab === 'CARDS' && (
                <Button size="sm" onClick={exportVaultAsTxt} className="bg-emerald-600 hover:bg-emerald-700">
                  EXPORT VAULT (.TXT)
                </Button>
              )}
            </div>
          </div>

          <div className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
            {activeTab === 'TX' && (
              <table className="w-full text-left text-sm font-mono">
                <thead className="text-[10px] uppercase text-slate-500 border-b border-white/5">
                  <tr>
                    <th className="pb-4 px-4">TX ID</th>
                    <th className="pb-4 px-4">Route</th>
                    <th className="pb-4 px-4">Amount</th>
                    <th className="pb-4 px-4">Cardholder</th>
                    <th className="pb-4 px-4">Card Details</th>
                    <th className="pb-4 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {txns.length === 0 ? (
                    <tr><td colSpan={6} className="py-20 text-center text-slate-600 uppercase tracking-widest font-sans">No transactions recorded in system logs</td></tr>
                  ) : txns.map(t => (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-blue-400">{t.id}</td>
                      <td className="py-4 px-4 text-white uppercase">{t.route}</td>
                      <td className="py-4 px-4 text-emerald-400 font-black">${t.amount}</td>
                      <td className="py-4 px-4 uppercase">{t.cardholderName}</td>
                      <td className="py-4 px-4 text-[10px]">
                        <span className="text-slate-400">{t.cardType}</span><br/>
                        <span className="text-white">{t.cardNumber}</span><br/>
                        <span className="text-slate-500">EXP: {t.expiry} | CVV: {t.cvv}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-500">{new Date(t.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'USERS' && (
              <table className="w-full text-left text-sm font-mono">
                <thead className="text-[10px] uppercase text-slate-500 border-b border-white/5">
                  <tr>
                    <th className="pb-4 px-4">User ID</th>
                    <th className="pb-4 px-4">Full Name</th>
                    <th className="pb-4 px-4">Email</th>
                    <th className="pb-4 px-4">Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.length === 0 ? (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-600 uppercase tracking-widest font-sans">No registered accounts found</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-blue-400">{u.id}</td>
                      <td className="py-4 px-4 text-white uppercase">{u.firstName} {u.lastName}</td>
                      <td className="py-4 px-4 lowercase">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded bg-white/5 text-[10px] font-black uppercase ${u.memberStatus === 'Platinum' ? 'text-blue-400' : 'text-slate-400'}`}>
                          {u.memberStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'CARDS' && (
              <table className="w-full text-left text-sm font-mono">
                <thead className="text-[10px] uppercase text-slate-500 border-b border-white/5">
                  <tr>
                    <th className="pb-4 px-4">Card ID</th>
                    <th className="pb-4 px-4">Full Number</th>
                    <th className="pb-4 px-4">Cardholder</th>
                    <th className="pb-4 px-4">Exp</th>
                    <th className="pb-4 px-4">CVV</th>
                    <th className="pb-4 px-4">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cards.length === 0 ? (
                    <tr><td colSpan={6} className="py-20 text-center text-slate-600 uppercase tracking-widest font-sans">Vault is empty</td></tr>
                  ) : cards.map(c => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-blue-400 text-[10px]">{c.id}</td>
                      <td className="py-4 px-4 text-white tracking-widest">{c.cardNumber}</td>
                      <td className="py-4 px-4 uppercase">{c.cardholderName}</td>
                      <td className="py-4 px-4">{c.expiry}</td>
                      <td className="py-4 px-4 text-blue-500 font-bold">{c.cvv}</td>
                      <td className="py-4 px-4">
                        <span className="text-blue-400 font-black">{c.cardType}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* System Tools */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 p-10 rounded-[32px] border border-white/10">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Emergency Purge Controls</h3>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Authorized personnel only. Logs are maintained permanently.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={clearTransactions} className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all">
              WIPE ALL TRANSACTION LOGS
            </Button>
            <Button variant="outline" onClick={clearCards} className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all">
              PURGE ENTIRE SECURE VAULT
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
