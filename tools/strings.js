// https://stackoverflow.com/questions/3943772/how-do-i-shuffle-the-characters-in-a-string-in-javascript
function shuffleString(s) {
  const a = s.split('');
  const n = a.length;

  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join('');
}

module.exports = {
  shuffleString,
};
