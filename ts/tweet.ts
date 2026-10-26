class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //live events use RunKeeper Live, e.g. "Watch my run right now with @Runkeeper Live"
        if (this.text.includes("right now") || this.text.includes("#RKLive")) {
            return "live_event";
        }
        //achievements are new personal records or goals the person set
        if (this.text.startsWith("Achieved") || this.text.includes("set a goal")) {
            return "achievement";
        }
        //completed events start with "Just completed a ..." or "Just posted a ..."
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        return "miscellaneous";
    }

    //helper: gets the part of the tweet after " - " with the link and #Runkeeper removed
    private getTextAfterDash():string {
        let dashIndex = this.text.indexOf(" - ");
        if (dashIndex == -1) {
            return "";
        }
        let result = this.text.substring(dashIndex + 3);
        //cut off everything from the link onwards
        let linkIndex = result.indexOf("https://");
        if (linkIndex != -1) {
            result = result.substring(0, linkIndex);
        }
        result = result.replace("#Runkeeper", "");
        return result.trim();
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        let afterDash = this.getTextAfterDash();
        if (afterDash == "" || afterDash == "TomTom MySports Watch") {
            return false;
        }
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        return this.getTextAfterDash();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //completed tweets look like "Just completed a 10.00 km run with ..." or "Just posted a yoga practice in 30:00 ..."
        let words = this.text.split(" ");
        let i = 3; //skip "Just completed a"
        //skip the distance and unit if there is one
        if (words[i + 1] == "km" || words[i + 1] == "mi") {
            i += 2;
        }
        //the activity is everything until "with", "-", or "in"
        let activity = "";
        while (i < words.length && words[i] != "with" && words[i] != "-" && words[i] != "in") {
            activity += words[i] + " ";
            i++;
        }
        return activity.trim();
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        let words = this.text.split(" ");
        //the distance is the 4th word and the unit is the 5th word
        let number = parseFloat(words[3]);
        if (words[4] == "mi") {
            return number;
        }
        if (words[4] == "km") {
            return number / 1.609; //convert km to miles
        }
        //activities like yoga don't have a distance
        return 0;
    }

    //BONUS: returns 'positive', 'negative', or 'neutral' based on the user-written text
    //word lists are a small subset of the Hu and Liu (2004) opinion lexicon
    get sentiment():string {
        let positiveWords = ["good", "great", "awesome", "amazing", "nice", "love", "loved", "happy", "fun",
            "beautiful", "best", "better", "perfect", "fantastic", "excellent", "wonderful", "strong", "fast",
            "easy", "enjoy", "enjoyed", "lovely", "glad", "proud", "fresh", "gorgeous", "cool", "brilliant",
            "pleasant", "win", "success", "successful", "improve", "improved", "progress", "thanks", "thank",
            "like", "solid", "comfortable", "excited", "favorite", "pb", "pr"];
        let negativeWords = ["bad", "tired", "hard", "tough", "hurt", "hurts", "pain", "painful", "sore",
            "slow", "worst", "worse", "hate", "sad", "awful", "terrible", "brutal", "struggle", "struggled",
            "exhausted", "sick", "injury", "injured", "difficult", "lazy", "boring", "cold", "miserable",
            "ugh", "fail", "failed", "dead", "dying", "horrible", "annoying", "rough", "heavy", "lost", "sucks"];

        //split the written text into lowercase words, ignoring punctuation
        let words = this.writtenText.toLowerCase().split(/[^a-z']+/);
        let score = 0;
        for (let i = 0; i < words.length; i++) {
            if (positiveWords.includes(words[i])) {
                score++;
            } else if (negativeWords.includes(words[i])) {
                score--;
            }
        }

        if (score > 0) {
            return "positive";
        } else if (score < 0) {
            return "negative";
        }
        return "neutral";
    }

    getHTMLTableRow(rowNumber:number):string {
        //turn every link in the tweet into a clickable <a> tag
        let tweetHTML = this.text.replace(/https:\/\/t\.co\/\w+/g, function(link) {
            return "<a href='" + link + "' target='_blank'>" + link + "</a>";
        });
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + tweetHTML + "</td><td>" + this.sentiment + "</td></tr>";
    }
}
