import React, { useState } from 'react';
import { 
  Binary, 
  Cpu, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  Terminal, 
  Code2, 
  FileCode2, 
  Sparkles, 
  ShieldCheck, 
  Fuel, 
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import { RECENT_TRANSACTIONS, MERKLE_TREE_DATA } from '../data/mockBlockchain';
import { BlockTransaction, MerkleNode, ProductItem } from '../types';

interface ExplorerViewProps {
  productsMap?: Record<string, ProductItem>;
  onInspectBarcode?: (code: string) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({ productsMap = {}, onInspectBarcode }) => {
  const [activeTab, setActiveTab] = useState<'merkle' | 'transactions' | 'contract'>('merkle');
  const [selectedLeaf, setSelectedLeaf] = useState<string>('leaf-1');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [contractQueryInput, setContractQueryInput] = useState('');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleContractQuery = () => {
    const trimmed = contractQueryInput.trim();
    if (!trimmed) return;
    setIsQuerying(true);
    setTimeout(() => {
      setIsQuerying(false);
      const item = productsMap[trimmed];
      if (item) {
        setQueryResult(`Contract Call Result for ${item.barcode}:
• Status: 1 (GENUINE_AUTHENTICATED)
• Title: ${item.title}
• Token ID: #${item.proof.tokenId || '1'} (${item.proof.tokenStandard || 'ERC-721 Soulbound'})
• Authorized Manufacturer: ${item.manufacturerAddress || '0x71F32A4B892c9082d4992147FeE7bF05719Ab301'} (${item.brand})
• Merkle Leaf Keccak256: ${item.proof.merkleLeafHash || '0x49e1028ba48201fa8723491bc8271e84a82194c2'}
• Mint Block Confirmation: #${item.proof.blockNumber || 19402118}
• Merkle Root: ${item.proof.merkleRoot}
• Gas Consumed: ${item.proof.gasUsed || '21,480 gas'}`);
      } else {
        setQueryResult(`Contract Call Result for ${trimmed}:
• Status: 0 (REVERTED / UNMINTED_BARCODE)
• Error: "ERC721URIStorage: Token not minted for requested GTIN hash"
• Merkle Tree State: Non-existent leaf
• Ledger Search: Zero matching digital twin entries across Sepolia blocks`);
      }
    }, 450);
  };


  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-sky-700 uppercase tracking-widest font-semibold mb-1">
            <span className="w-2 h-2 rounded bg-sky-600"></span>
            Ethereum Sepolia Ledger Explorer
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Blockchain Explorer & Merkle Engine
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Audit immutable smart contracts, inspect real-time zero-knowledge proofs, and verify Keccak256 Merkle branches.
          </p>
        </div>

        {/* Network status badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">Sepolia Block #19,402,120</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs font-mono text-xs text-sky-700 font-semibold">
            TPS: 48.2
          </div>
        </div>
      </div>

      {/* Explorer Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('merkle')}
          className={`px-4 py-2 rounded-lg font-heading text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'merkle'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Interactive Merkle Proof Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-lg font-heading text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'transactions'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Binary className="w-4 h-4" />
          <span>Recent Ledger Transactions</span>
        </button>

        <button
          onClick={() => setActiveTab('contract')}
          className={`px-4 py-2 rounded-lg font-heading text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'contract'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Verified Solidity Contract (ABI)</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE MERKLE PROOF TREE ENGINE */}
      {activeTab === 'merkle' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-600" />
                  Keccak-256 Merkle Proof Visualizer
                </h2>
                <p className="text-xs text-slate-500">
                  Click on individual batch leaves to inspect how zero-knowledge consensus constructs the cryptographic proof path to the Sepolia root hash.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Active Path Verified
                </span>
              </div>
            </div>

            {/* Tree Diagram Visualizer */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 overflow-x-auto">
              <div className="min-w-[640px] flex flex-col items-center gap-8 py-4">
                
                {/* Level 0: Root */}
                <div className="flex flex-col items-center">
                  <div className="px-5 py-3 rounded-xl bg-white border-2 border-emerald-500 shadow-md flex flex-col items-center text-center">
                    <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold tracking-wider">
                      On-Chain Merkle Root (Block #19,402,118)
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-900 mt-0.5">
                      {MERKLE_TREE_DATA.hash.slice(0, 24)}...
                    </span>
                  </div>
                  <div className="w-0.5 h-6 bg-slate-300"></div>
                </div>

                {/* Level 1: Branch Nodes */}
                <div className="w-full flex justify-around relative">
                  {/* Connecting Horizontal Line */}
                  <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-300"></div>

                  {/* Branch L1 */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-slate-300"></div>
                    <div className={`px-4 py-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                      selectedLeaf.startsWith('leaf-1') || selectedLeaf.startsWith('leaf-2')
                        ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200'
                    }`}>
                      <span className="text-[10px] font-mono uppercase text-sky-700 font-semibold">
                        Branch Node H₁₋₂ (Batch #4109)
                      </span>
                      <span className="font-mono text-xs text-slate-800">
                        {MERKLE_TREE_DATA.left?.hash.slice(0, 18)}...
                      </span>
                    </div>
                    <div className="w-0.5 h-6 bg-slate-300"></div>
                  </div>

                  {/* Branch R1 */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-slate-300"></div>
                    <div className={`px-4 py-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                      selectedLeaf.startsWith('leaf-3') || selectedLeaf.startsWith('leaf-4')
                        ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200'
                    }`}>
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                        Branch Node H₃₋₄ (Batch #4110)
                      </span>
                      <span className="font-mono text-xs text-slate-600">
                        {MERKLE_TREE_DATA.right?.hash.slice(0, 18)}...
                      </span>
                    </div>
                    <div className="w-0.5 h-6 bg-slate-300"></div>
                  </div>
                </div>

                {/* Level 2: Leaves (Selectable) */}
                <div className="w-full grid grid-cols-4 gap-4">
                  {[
                    { id: 'leaf-1', label: 'Leaf 0: SN-CHRONO-890103', hash: '0x890103...4a', desc: 'Chronograph Regalia #4109' },
                    { id: 'leaf-2', label: 'Leaf 1: SN-CHRONO-890104', hash: '0x890104...b1', desc: 'Chronograph Regalia #4110' },
                    { id: 'leaf-3', label: 'Leaf 2: SN-CHRONO-890105', hash: '0x890105...c2', desc: 'Chronograph Regalia #4111' },
                    { id: 'leaf-4', label: 'Leaf 3: SN-CHRONO-890106', hash: '0x890106...d3', desc: 'Chronograph Regalia #4112' }
                  ].map((leaf) => {
                    const isSelected = selectedLeaf === leaf.id;
                    return (
                      <button
                        key={leaf.id}
                        onClick={() => setSelectedLeaf(leaf.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`font-mono text-[10px] font-semibold uppercase ${
                          isSelected ? 'text-emerald-100' : 'text-slate-500'
                        }`}>
                          {leaf.label}
                        </div>
                        <div className="font-mono text-xs font-bold truncate mt-0.5">
                          {leaf.hash}
                        </div>
                        <div className={`text-[11px] truncate mt-1 ${
                          isSelected ? 'text-emerald-50' : 'text-slate-500'
                        }`}>
                          {leaf.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Proof Computation Log Drawer */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Terminal className="w-3.5 h-3.5" />
                  AUTHENTIX KECCAK-256 PROOF EXECUTION
                </span>
                <span>Depth: 12 · Gas: 21,480</span>
              </div>
              <div className="text-slate-300">
                &gt; Selected Target Leaf: <span className="text-emerald-400">{selectedLeaf}</span><br />
                &gt; Sibling Hash: <span className="text-sky-400">0x890104...b1 (Leaf 1)</span><br />
                &gt; Combined Hash: keccak256(Leaf 0 + Leaf 1) =&gt; <span className="text-amber-400">0x49e1028ba48201fa8723491bc8271e84a82194c2</span><br />
                &gt; Parent Node Comparison: matches Sepolia storage slot <span className="text-emerald-400">0x8f3a992bbca30172e0182419ef257aa4c194a21e78c41295db283949817281bc</span><br />
                &gt; VERDICT: <span className="text-emerald-400 font-bold">TRUE · INCLUSION PROVED ON-CHAIN</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: RECENT LEDGER TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              Live Ethereum Sepolia Event Stream
            </h2>
            <p className="text-xs text-slate-500">
              Contract calls invoking <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">verifyScan</code>, <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">batchMint</code>, and <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">updateCustody</code>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/70">
                  <th className="py-2.5 px-3 font-semibold">TX HASH</th>
                  <th className="py-2.5 px-3 font-semibold">BLOCK</th>
                  <th className="py-2.5 px-3 font-semibold">METHOD</th>
                  <th className="py-2.5 px-3 font-semibold">ITEM / PAYLOAD</th>
                  <th className="py-2.5 px-3 font-semibold">FROM / SIGNER</th>
                  <th className="py-2.5 px-3 font-semibold">STATUS</th>
                  <th className="py-2.5 px-3 font-semibold text-right">TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_TRANSACTIONS.map((tx) => (
                  <tr key={tx.hash} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-sky-700 font-semibold flex items-center gap-1.5">
                      <span>{tx.hash}</span>
                      <button
                        onClick={() => copyToClipboard(tx.hash, tx.hash)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {copiedText === tx.hash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      #{tx.blockNumber}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold">
                        {tx.method}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-slate-900">{tx.productName}</div>
                      <div className="font-mono text-[10px] text-slate-500">GS1: {tx.barcode}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {tx.from}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        tx.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-sans">
                      {tx.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VERIFIED SOLIDITY SMART CONTRACT */}
      {activeTab === 'contract' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Solidity Source Code (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-emerald-600" />
                <span className="font-heading font-bold text-sm text-slate-900">
                  AuthentixRegistry.sol (Verified v0.8.24)
                </span>
              </div>
              <span className="font-mono text-xs text-slate-500">OpenZeppelin ERC-5192</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed">
              <pre>{`// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract AuthentixRegistry is AccessControl {
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant ORACLE_VALIDATOR_ROLE = keccak256("ORACLE_VALIDATOR_ROLE");

    struct DigitalTwin {
        uint256 tokenId;
        bytes32 merkleRoot;
        bytes32 barcodeHash;
        address manufacturer;
        uint64 genesisTimestamp;
        bool isRevoked;
    }

    mapping(bytes32 => DigitalTwin) public registry;
    mapping(bytes32 => bool) public blacklistedHashes;

    event ProductMinted(bytes32 indexed barcodeHash, address indexed manufacturer);
    event CustodyLogged(bytes32 indexed barcodeHash, string location, uint256 blockTimestamp);
    event CounterfeitQuarantined(bytes32 indexed barcodeHash, string reason);

    function verifyTwin(
        bytes32 barcodeHash,
        bytes32[] calldata proof,
        bytes32 leaf
    ) external view returns (bool isValid, address issuer) {
        require(!blacklistedHashes[barcodeHash], "AUTHENTIX: Hash blacklisted");
        DigitalTwin memory twin = registry[barcodeHash];
        require(twin.genesisTimestamp > 0, "AUTHENTIX: Unregistered product");
        
        bool proofValid = MerkleProof.verify(proof, twin.merkleRoot, leaf);
        return (proofValid, twin.manufacturer);
    }
}`}</pre>
            </div>
          </div>

          {/* Interactive Contract Tester (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Simulated Read Contract Runner
              </h3>
              <p className="text-xs text-slate-500">
                Call <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">verifyTwin()</code> directly via zero-latency provider.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Query Parameter (_barcode):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={contractQueryInput}
                    onChange={(e) => setContractQueryInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    onClick={handleContractQuery}
                    disabled={isQuerying}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {isQuerying ? 'Calling...' : 'Call'}
                  </button>
                </div>
              </div>

              {queryResult && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                  {queryResult}
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 space-y-1">
              <div className="font-semibold">Contract Deployment Address:</div>
              <div className="font-mono text-[11px] break-all">
                0x71F32A4B892c9082d4992147FeE7bF05719Ab301
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
