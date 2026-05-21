const banWord = ['đm', 'vcl', 'địt', 'chó', 'lồn', 'cứt', 'ngu', 'cặc']; //danh sách các từ bị cấm

function censorComment(text) {
  if (!text) return text;
  let censoredText = text;
  banWord.forEach(word => {
    const regex = new RegExp(word, 'gi');
    censoredText = censoredText.replace(regex, '*'.repeat(word.length));
  });
  return censoredText;
}

module.exports = { censorComment };