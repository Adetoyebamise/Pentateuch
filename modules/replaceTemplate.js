module.exports = (template, torah) => {
  let output = template.replace(/{%TORAHNAME%}/g, torah.bookName);
  output = output.replace(/{%TORAHCHAPTERS%}/g, torah.numbersOfChapters);
  output = output.replace(/{%TORAHAUTHOR%}/g, torah.author);
  output = output.replace(/{%TORAHDESCRIPTION%}/g, torah.description);
  output = output.replace(/{%ID%}/g, torah.id);
  if (!torah.calledTheBookOfTheLaw)
    output = output.replace(/{%NOT-BOOK-OF-THE-LAW%}/g, "not-book-of-the-law");
  return output;
};
