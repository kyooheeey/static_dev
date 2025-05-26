/**
 * 日付をフォーマットする関数
 * @param {Date} date - フォーマットする日付
 * @returns {string} フォーマットされた日付文字列
 */
export const formatDate = (date) => {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};