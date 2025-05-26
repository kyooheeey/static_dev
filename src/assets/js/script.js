// モジュールのインポート
import { formatDate } from './utils/date.js';

// DOMの読み込み完了時に実行
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  console.log('Current date:', formatDate(new Date()));
});