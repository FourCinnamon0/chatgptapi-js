
let key;
function setSecret(secret) {
	key = secret
}
module.exports.setSecret = setSecret;
class Conversation {
	constructor (messages){
		this.messages = []
		this.model = "gpt-3.5-turbo"
		this.key = key
		if(messages){this.messages = messages}else(this.ChatGPTPreamble())
	}
	ChatGPTPreamble(){
		this.messages.push({role: "system", content: `You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: 2021-09
Current date: ${new Date().toISOString().split("T",1)[0]}`})
	}
	setRawMessages(messages) {
		this.messages = messages
	}
	getRawMessages(){
		return this.messages
	}
	addMsgs(messages){
		this.messages = this.messages.concat(messages)
	}
	async chat(content,role){
		this.messages.push({role: role, content: content})
		if(role == "user"){
			return await this.send()
			// console.dir(await this.processReq(), {depth: null})
		}
	}
	async send(){
		let res = await this.req();
		if(res.error){
			console.error("Raw response:",res)
			throw new Error("ChatGPTAPIError:",res.error)
		}
		this.messages.push(res.choices[0].message)
		return res.choices[0].message
	}
	async req(){
		if(!this.key){
			throw new Error("OpenAI API key has not been set! Use Conversation.setSecret to set your API key")
		}
		return await (await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${this.key}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({model: this.model, messages: this.messages})
			// body: '{\\\n  "model": "gpt-3.5-turbo",\\\n  "messages": [{"role": "user", "content": "What is the OpenAI mission?"}]\n}'
		})).json()
	}
	setSecret(secret) {
		this.key = secret
	}
}
module.exports.Conversation = Conversation;
// const readline = require("readline")
// const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// async function main(){
// 	let conversation = new Conversation()
// 	conversation.setSecret("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")
// 	async function chat(text) {
// 		console.log((await conversation.chat(text, "user")).content)
// 	}
// 	rl.on("line",chat)
// }
// main();