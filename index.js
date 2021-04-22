const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

//  =============== FIles
//reading file content and writing to a files : blocking, synchronous way
// const textIn = fs.readFileSync("./text/input.txt", "utf-8");
// console.log(textIn);

// const textOut = ` ${textIn} \n - The Mosaic Authorship \n created on ${Date.now()}`
// fs.writeFileSync("./text/output.txt", textOut);
// console.log("file written");

// non-blocking, asynchronous way
// fs.readFile("./text/start.txt" , "utf-8",(error, data1) => {
//   if (error) {
//     console.log("an error occurred");
//   }else {
//     console.log(data1);
//       fs.readFile(`./text/${data1}.txt` , "utf-8",(error, data2) => {
//         if (error) {
//           console.log("an error occurred");
//         }else {
//           console.log(data2);
//           fs.readFile("./text/append.txt" , "utf-8",(error, data3) => {
//             if (error) {
//               console.log("an error occurred");
//             }else {
//               console.log(data3);
//                 fs.writeFile("./text/final.txt", `${data2} \n ${data3}` , "utf-8", error => {   //write to a file
//                  if (error) {
//                   console.log("an error occurred");
//                  } else {
//                   console.log("file written");
//                 };
//              });
//            };
//          });
//        };
//      });
//    };
// });
// console.log("will read file");

//   ================= Server
// const replaceTemplate = (template, torah) => {
//   let output = template.replace(/{%TORAHNAME%}/g, torah.bookName);
//   output = output.replace(/{%TORAHCHAPTERS%}/g, torah.numbersOfChapters);
//   output = output.replace(/{%TORAHAUTHOR%}/g, torah.author);
//   output = output.replace(/{%TORAHDESCRIPTION%}/g, torah.description);
//   output = output.replace(/{%ID%}/g, torah.id);
//   if (!torah.calledTheBookOfTheLaw)
//     output = output.replace(/{%NOT-BOOK-OF-THE-LAW%}/g, "not-book-of-the-law");
//   return output;
// };
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const pentateuch = fs.readFileSync(
  `${__dirname}/dev-data/pentateuch.json`,
  "utf-8"
);
const dataObject = JSON.parse(pentateuch); //dataObject is an array of 5 object
const slugs = dataObject.map((element) =>
  slugify(element.bookName, { lower: true })
);
console.log(slugs);
//console.log(slugify("genesis", { lower: true }));
const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);
  console.log(request.url);
  console.log(url.parse(request.url, true));
  //const pathname = request.url;
  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, { "content-type": "text/html" });
    const torahCardsHtml = dataObject
      .map((element) => replaceTemplate(templateCard, element))
      .join("");
    const output = templateOverview.replace("{%TORAHCARDS%}", torahCardsHtml);
    console.log(torahCardsHtml);
    response.end(output);
    //Product Page
  } else if (pathname === "/product") {
    response.writeHead(200, { "content-type": "text/html" });
    const torah = dataObject[query.id];
    const output = replaceTemplate(templateProduct, torah);
    console.log(query);
    response.end(output);
    //API
  } else if (pathname === "/api") {
    //fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (error, data) => {
    //const productData = JSON.parse(data);
    response.writeHead(200, { "content-type": "application/json" });
    response.end(data);
    //});
    //Not Found
  } else {
    response.writeHead(404, {
      "content-type": "text/html",
    });
    response.end("<h1>page not found</h1>");
  }
  //console.log(request.url);
  //console.log(request);
  //response.end("Hello from the server!");  // send something to the client
});
server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
});
