
// rbxapi.ts
// module containing wrapper functions for dealing with the roblox api
// @kalrnlo
// 25/03/2024

const base_url = "https://apis.roblox.com/"

type avatar_thumbnail_type = "avatar" | "avatar-bust" | "avatar-headshot"

type avatar_headshot_sizes = "48x48" | "50x50" | "60x60" | "75x75" | "100x100" | "110x110" | "150x150" | "180x180" |
	"352x352" | "420x420" | "720x720"

type avatar_body_sizes = "30x30" | "48x48" | "60x60" | "75x75" | "100x100" | "110x110" | "140x140" | "150x150" |
	"150x200" | "180x180" | "250x250" | "352x352" | "420x420" | "720x720"

type avatar_bust_sizes = "48x48" | "50x50" | "60x60" | "75x75" | "100x100" | "150x150" | "180x180" | "352x352" |
	"420x420"

type avatar_thumbnail_size = avatar_headshot_sizes | avatar_body_sizes | avatar_bust_sizes

type PlayerThumbnailData = {
	imageUrl: string,
	targetId: number,
	state: string,
}

type thumbnail_opts = {
	format: "png" | "jpeg"?,
	is_circular: boolean?,
	max_retrys: number?,
}

type membership_info = {
	user_id: string,
	rank: number,
}

function timeout (ms: number): Promise<any> {
	return new Promise(resolve => { setTimeout(resolve, ms) })
}

export class rbxapi {
	static config = {
		messaging_service_key = "",
		retry_delay = 500,
		universe_id = 0,
		group_key = "",
	}

	// ive sinned
	static get_membership_info_for_users(group: number, userids: Array<number>, maxpagesize: number?, pagetoken: string?): Promise<{membership_info: membership_info[], next_page_token: string}> {
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

		fetch(requesturl, { headers = new Headers("x-api-key", this.config.group_key) }).then(function(responce) {
			// fix to handle roblox error codes
			responce.json().then(function(jsonobj) {
				next_page_token = jsonobj.nextPageToken
				let index = 0

				for ([key, value] in Object.entries(jsonobj.groupMemberships)) {
					membership_info_array[index] = {
						user_id = (value.user as string).substring(6),
						rank = Number((value.role as string).substring(rank_sub_start_index))
					}
					
					index++
				}
			}, (reason) => {console.error(reason)})
		}, (reason) => {console.error(reason)})

		return nextpagetoken !== null ? Promise.resolve({
			membership_info = membership_info_array as {
				user_id: string,
				rank: string,
			}[],
			next_page_token = next_page_token as string,
		}) : Promise.reject()
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
			// fix to handle roblox error codes
			responce.json().then(function(jsonobj) {
				success = Object.keys(jsonobj.body).length === 0
			}, (reason) => {console.error(reason)})
		}, (reason) => {console.error(reason)})

		if (success === true) {
			return Promise.resolve("")
		} else {
			return Promise.reject("roblox api experienced an error")
		}
	}

	// based on: https://github.com/noblox/noblox.js/blob/master/lib/thumbnails/getPlayerThumbnail.js
	static get_thumbnails(
		type: avatar_thumbnail_type,
		size: avatar_thumbnail_size,
		user_ids: number[],
		opts: thumbnail_opts?,
	): Promise<PlayerThumbnailData[]> {
		if (user_ids.length > 100) {
			return Promise.reject("cannot get more than 100 thumbnails in bulk at a time")
		}

		const is_circular = opts.is_circular !== null ? opts.is_circular : false
		const max_retrys = opts.max_retrys || 2
		const format = opts.format || "jpeg"
		let result

		fetch(
			`https://thumbnails.roblox.com/v1/users/${type}?userIds=${user_ids.join(",")}&size=${size}&format=${format}&isCircular=${is_circular}`, {
				"Content-Type": "application/json",
			}
		).then(async(responce) => {
			if (responce.status === 200) {
				responce.json().then(function(data) {
					if (max_retrys > 0) {
						// Get 'Pending' thumbnails as array of userIds
						const pending_thumbnails = data.filter(obj => { return obj.state === 'Pending' }).map(obj => obj.targetId)
	
						if (pending_thumbnails.length > 0) {
							// small delay helps cache populate on Roblox's end; default 500ms
							await timeout(this.config.retry_delay) // small delay helps cache populate on Roblox's end; default 500ms
							
							--opts.max_retrys
							// Recursively retry for # of maxRetries attempts; default 2
							const updated_pending = await this.get_thumbnails(type, size, pending_thumbnails, opts)
							// Update primary array's values
							data = data.map(obj => updated_pending.find(o => o.targetId === obj.targetId) || obj)
						}
					}

					data = data.map(obj => {
						if (obj.state !== 'Completed') {
						  obj.imageUrl = `https://noblox.js.org/moderatedThumbnails/moderatedThumbnail_${size}.png`
						}
						return obj
					})
					result = data
				}, (reason) => {console.error(reason)})
			} else if (responce.status === 400) {
				console.error(`Error Code ${responce.status}: ${responce.statusText}, type: ${type}, user_ids: ${user_ids.join(',')}, size: ${size}, is_circular: ${is_circular}`)
			} else {
				console.error(`An unknown error occurred with get_thumbnail(), type: ${type}, user_ids: ${user_ids.join(',')}, size: ${size}, is_circular: ${is_circular}`)
			}
 		}, (reason) => {console.error(reason)})

		return result !== null ? Promise.resolve(result) : Promise.reject()
	}
}


