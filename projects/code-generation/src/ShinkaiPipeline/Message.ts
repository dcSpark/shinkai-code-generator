export enum MessageType {
    START,
    TITLE,
    MESSAGE,
    DEBUG,
    THINKING,
    CACHE,
    LOADING,
    START_METADATA,
}

export class Message {
    constructor(
        private readonly type: MessageType,
        private readonly message: string,
    ) { }


    public getMessage(): string {
        switch (this.type) {
            case MessageType.START:
                return `## Code Generation${Message.MD_EOL}id: ${this.message}${Message.MD_EOL}`;
            case MessageType.START_METADATA:
                return `## Metadata Generation${Message.MD_EOL}id: ${this.message}${Message.MD_EOL}`;
            case MessageType.TITLE:
                return `### ${this.message}${Message.MD_EOL}`;
            case MessageType.MESSAGE:
                return `${this.message}${Message.MD_EOL}`;
            case MessageType.DEBUG:
                return (Deno.env.get("DEBUG") === "true") ? `[DEBUG] ${this.message}${Message.MD_EOL}` : "";
            case MessageType.THINKING:
                return `*Thinking about:* ${this.message}${Message.MD_EOL}`;
            case MessageType.CACHE:
                return (Deno.env.get("DEBUG") === "true") ? `[CACHE] ${this.message}${Message.MD_EOL}` : "";
            case MessageType.LOADING:
                return Message.LOADING_MESSAGES[Math.floor(Math.random() * Message.LOADING_MESSAGES.length)] + " " + this.message + Message.MD_EOL;
        }
    }
    private static MD_EOL = "  \n";

    private static LOADING_MESSAGES = [
        "Warming up my neural networks...",
        "Consulting the digital oracle...",
        "Thinking at the speed of light...",
        "Gathering digital wisdom...",
        "Pondering your question deeply...",
        "Assembling brilliant thoughts...",
        "Processing at superhuman speed...",
        "Connecting the digital dots...",
        "Searching for the perfect answer...",
        "Converting caffeine to code...",
        "Analyzing countless possibilities...",
        "Organizing a symphony of algorithms...",
        "Brewing your response...",
        "Summoning digital intelligence...",
        "Diving into data oceans...",
        "Calculating optimal responses...",
        "Breaking the problem into bytes...",
        "Exploring the knowledge universe...",
        "Consulting my silicon brain...",
        "Crunching numbers and ideas...",
        "Decoding your request...",
        "Spinning up extra processors...",
        "Entering the zone of deep thought...",
        "Teaching electrons new tricks...",
        "Deploying smart algorithms...",
        "Navigating the neural labyrinth...",
        "Channeling digital brilliance...",
        "Activating advanced reasoning...",
        "Arranging ones and zeros artfully...",
        "Loading creativity modules...",
        "Generating insights just for you...",
        "Contemplating at quantum speeds...",
        "Working digital magic...",
        "Threading together clever thoughts...",
        "Optimizing response parameters...",
        "Weaving knowledge tapestries...",
        "Constructing thoughtful analysis...",
        "Pondering the digital cosmos...",
        "Calibrating intelligence circuits...",
        "Firing up the idea engine...",
        "Focusing digital consciousness...",
        "Mining data gold for you...",
        "Thinking harder than ever...",
        "Bending electrons to my will...",
        "Crafting an artisanal response...",
        "Sifting through information galaxies...",
        "Engaging neural hyperdrive...",
        "Reaching peak processing power...",
        "Distilling complex concepts...",
        "Exploring all relevant dimensions...",
        "Discovering unexpected connections...",
        "Assembling digital wisdom...",
        "Tuning my thinking parameters...",
        "Gathering intellectual momentum...",
        "Pushing cognitive boundaries...",
        "Connecting knowledge constellations...",
        "Surfing data waves...",
        "Untangling complex patterns...",
        "Polishing response jewels...",
        "Balancing logic and creativity...",
        "Plucking insights from the digital tree...",
        "Conducting a thought symphony...",
        "Harmonizing with your question...",
        "Engaging maximum brain power...",
        "Solving the knowledge puzzle...",
        "Reading between the digital lines...",
        "Scanning possibility horizons...",
        "Interpreting information landscapes...",
        "Applying artificial intuition...",
        "Synthesizing digital enlightenment...",
        "Mixing secret thought ingredients...",
        "Diving into the depths of knowledge...",
        "Architecting the perfect answer...",
        "Calculating the ideal response...",
        "Collecting scattered digital wisdom...",
        "Brainstorming at the speed of light...",
        "Building response foundations...",
        "Painting with digital thought-colors...",
        "Aligning neural pathways...",
        "Consulting my extensive training...",
        "Entering deep thinking mode...",
        "Finding the signal in the noise...",
        "Crystallizing complex concepts...",
        "Mapping the idea territory...",
        "Forging connections between concepts...",
        "Engaging cognitive afterburners...",
        "Merging diverse knowledge streams...",
        "Traversing the information highway...",
        "Bringing clarity to complexity...",
        "Channeling artificial brilliance...",
        "Precision-crafting your answer...",
        "Sorting through digital libraries...",
        "Executing thought protocols...",
        "Assembling digital puzzle pieces...",
        "Zooming through knowledge domains...",
        "Wrangling wild data points...",
        "Illuminating dark data corners...",
        "Deploying digital philosophers..."
    ]

}