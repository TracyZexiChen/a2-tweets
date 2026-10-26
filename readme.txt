--Readme document for Tracy Zexi Chen, zexic7@uci.edu*--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

11/10
- 3/3 Summarizing tweets
- 4/4 Identifying the most popular activities
- 4/3 Adding a text search interface (with one bonus point for finishing Sentiment mining)

2. How long, in hours, did it take you to complete this assignment?

It took about 9 hours to complete this assignment


3. What online resources did you consult when completing this assignment? (list sites like StackOverflow or specific URLs for tutorials; describe queries to Generative AI or use of AI-based code completion)

I used the Typescript lecture slides and these online resources:
Background paper:
- Epstein et al., From "Nobody Cares" to "Way to Go!", CSCW 2015: https://doi.org/10.1145/2675133.2675135

Setting up:
- nvm: https://github.com/nvm-sh/nvm
- live-server: https://www.npmjs.com/package/live-server
- tsconfig reference: https://www.typescriptlang.org/tsconfig
- TypeScript playground (to test small pieces of code): https://www.typescriptlang.org/play

TypeScript / Tweet class (tweet.ts):
- TypeScript in 5 minutes: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- TypeScript for the new programmer: https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html
- TypeScript handbook, classes and getters: https://www.typescriptlang.org/docs/handbook/2/classes.html
- typescripttutorial.net getters and setters tutorial: https://www.typescripttutorial.net/typescript-tutorial/typescript-getters-setters/
- javascript.info classes tutorial: https://javascript.info/class
- MDN getter: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
- javascript.info regex introduction: https://javascript.info/regexp-introduction
- regex101 (to test the link regex): https://regex101.com

Part 1 (about.js):
- javascript.info dates tutorial: https://javascript.info/date
- MDN toLocaleDateString: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
- math.js format: https://mathjs.org/docs/reference/functions/format.html
- MDN querySelectorAll: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
- MDN innerText: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText

Part 2 (activities.js):
- Vega-Lite getting started tutorial: https://vega.github.io/vega-lite/tutorials/getting_started.html
- Vega-Lite exploring data tutorial (aggregation): https://vega.github.io/vega-lite/tutorials/explore.html
- Vega-Lite embedding in a web page: https://vega.github.io/vega-lite/usage/embed.html
- Vega-Lite examples gallery: https://vega.github.io/vega-lite/examples/
- Vega-Lite online editor: https://vega.github.io/editor/
- Vega-Lite docs for data, mark, encoding, type, aggregate, and sort:
  https://vega.github.io/vega-lite/docs/
- vega-embed: https://github.com/vega/vega-embed
- javascript.info array methods tutorial: https://javascript.info/array-methods
- MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/

Part 3 (descriptions.js):
- MDN DOM scripting tutorial: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting
- MDN events tutorial: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events
- The Odin Project, DOM manipulation and events: https://www.theodinproject.com/lessons/foundations-dom-manipulation-and-events
- javascript.info change and input events: https://javascript.info/events-change-input
- javascripttutorial.net input event: https://www.javascripttutorial.net/javascript-dom/javascript-input-event/
- MDN API: https://developer.mozilla.org/en-US/docs/Web/API/

Bonus (sentiment):
- Hu and Liu opinion lexicon: https://www.cs.uic.edu/~liub/FBS/sentiment-analysis.html

For this assignment, I used AI, including Claude and ChatGPT, to help me understand the concept behind it and debug code. For example, I asked ChatGPT: "Could you explain what the DOM is in detail to me? I don't fully understand from the lecture slides. Remind me why I need to use the DOM." Besides this, I also copied several lines of my code that I was not fully confident about and felt like they had some bugs, including that adding the code doesn't change the UI in the HTML file:  "Here's my code:... (my actual code). I have a question about why this code does not work for ... (what features I want)."



4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

I didn't discuss with any other classmates. The entire assignment is done individually.


5. Is there anything special we need to know in order to run your code?

N/A


Bonus features:
Sentiment mining. I added a "sentiment" getter to the Tweet class (tweet.ts) that looks at the
user-written text and labels it "positive", "negative", or "neutral". It uses a short list of positive and negative words I picked from the Hu and Liu (2004) opinion lexicon. Each positive word adds 1 and each negative word subtracts 1; above 0 is positive, below 0 is negative, and 0 is neutral. The sentiment shows up as a new "Sentiment" column in the search table on the descriptions page (I added one <th> to descriptions.html for this column). For example, searching "great" gives mostly positive tweets, and searching "tired" gives mostly negative ones.


