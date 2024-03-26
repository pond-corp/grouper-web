
// rbxapi.ts
// module containing wrapper functions for dealing with the roblox api
// @kalrnlo
// 25/03/2024

const base_url = "https://apis.roblox.com/"

export class rbxapi {
	static config = {
		messaging_service_key = "",
		group_api_key = "",
		universe_id = 0,
	}

	static get_membership_info_for_users(group: number, userids: Array<number>, maxpagesize: number?, pagetoken: string?) {
		const rank_sub_start_index = group.toString().length() + 13
		let filter: string

		if (userids.length > 1) {
			filter = `filter="user in [`
	
			userids.forEach(function(value, index) {
				if (index !== userids.length - 1) {
					this += `'users/${value}', `
				} else {
					this += `'users/${value}']"`
				}
			}, filter)
		} else if (userids.length === 1) {
			filter = `filter="user == 'users/${userids[0] || 0}'" `
		} else {
			return Promise.reject("userids array was left empty")
		}

		let requesturl = base_url + `cloud/v2/groups/${group}/memberships?maxPageSize=${maxpagesize || 10}&filter=${filter}`

		if (pagetoken !== null) {
			requesturl + `&pageToken=${pagetoken}`
		}
		let membership_info_array = new Array(userids.length())
		let next_page_token

		fetch(requesturl, { headers = new Headers("x-api-key", this.config.group_api_key) }).then(function(responce) {
			responce.json().then(function(jsonobj) {
				next_page_token = jsonobj.nextPageToken
				let index = 0

				for ([key, value] in Object.entries(jsonobj.groupMemberships)) {
					membership_info_array[index] = {
						user_id = (value.user as string).substring(6),
						rank = (value.role as string).substring(rank_sub_start_index)
					}
					
					index++
				}
			}, (reason) => console.error)
		}, (reason) => console.error)

		if (nextpagetoken !== null) {
			return Promise.resolve({
				membership_info_array = membership_info_array as {
					user_id: string,
					rank: string,
				}[],
				next_page_token = next_page_token as string,
			})
		} else {
			return Promise.reject()
		}
	}

	static send_message(topic: string, message: string): Promise<null> {
		if (message.length() > 1024) {
			return Promise.reject("message cannot be longer than 1024 characters")
		} else if (topic.length() > 80) {
			return Promise.reject("topic cannot be longer than 80 characters")
		}
		let success = false

		fetch(base_url + `messaging-service/v1/universes/${this.config.universe_id}/topics/${topic}`, {
			headers = new Headers({
				"x-api-key": this.config.messaging_service_key,
				"Content-Type": "application/json",
			}),
			body = {
				"message": message,
			},
			method = "POST",
		}).then(function(responce) {
			responce.json().then(function(jsonobj) {
				success = Object.keys(jsonobj.body).length === 0
			}, (reason) => console.error)
		}, (reason) => console.error)

		if (success === true) {
			return Promise.resolve("")
		} else {
			return Promise.reject("roblox api experienced an error")
		}
	}

	static get_thumbnails(userids: number[]) {

	}
}

