
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

type thumbnail_opts = {
	format: "png" | "jpeg"?,
	is_circular: boolean?,
	max_retrys: number?,
}

export class rbxapi {
	static config = {
		messaging_service_key = "",
		retry_delay = 500,
		universe_id = 0,
		group_key = "",
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

		fetch(requesturl, { headers = new Headers("x-api-key", this.config.group_key) }).then(function(responce) {
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

	// based on: https://github.com/noblox/noblox.js/blob/master/lib/thumbnails/getPlayerThumbnail.js
	static get_thumbnails(
		type: avatar_thumbnail_type,
		size: avatar_thumbnail_size,
		user_ids: number[],
		opts: thumbnail_opts?,
	) {
		if (user_ids.length > 100) {
			return Promise.reject("cannot get more than 100 thumbnails in bulk at a time")
		}

		const is_circular = opts.is_circular !== null ? opts.is_circular : false
		const max_retrys = opts.max_retrys || 10
		const format = opts.format || "jpeg"

		fetch(
			`https://thumbnails.roblox.com/v1/users/${type}?userIds=${user_ids.join(",")}&size=${size}&format=${format}&isCircular=${is_circular}`, {
				"Content-Type": "application/json",
			}
		).then()
	}
}

function getPlayerThumbnail (userIds, size, format = 'png', isCircular = false, cropType = 'body', retryCount = settings.maxRetries) {
	return http({
	  url: `https://thumbnails.roblox.com/v1/users/${endpoint}?userIds=${userIds.join(',')}&size=${size}&format=${format}&isCircular=${!!isCircular}`,
	  options: {
		resolveWithFullResponse: true,
		followRedirect: true
	  }
	})
	  .then(async ({ statusCode, body }) => {
		let { data, errors } = JSON.parse(body)
		if (statusCode === 200) {
		  if (retryCount > 0) {
			const pendingThumbnails = data.filter(obj => { return obj.state === 'Pending' }).map(obj => obj.targetId) // Get 'Pending' thumbnails as array of userIds
			if (pendingThumbnails.length > 0) {
			  await timeout(settings.retryDelay) // small delay helps cache populate on Roblox's end; default 500ms
			  const updatedPending = await getPlayerThumbnail(pendingThumbnails, size, format, isCircular, cropType, --retryCount) // Recursively retry for # of maxRetries attempts; default 2
			  data = data.map(obj => updatedPending.find(o => o.targetId === obj.targetId) || obj) // Update primary array's values
			}
		  }
		  data = data.map(obj => {
			if (obj.state !== 'Completed') {
			  const settingsUrl = settings.failedUrl[obj.state.toLowerCase()] // user defined settings.json default image URL for blocked or pending thumbnails; default ""
			  obj.imageUrl = settingsUrl || `https://noblox.js.org/moderatedThumbnails/moderatedThumbnail_${size}.png`
			}
			return obj
		  })
		  return data
		} else if (statusCode === 400) {
		  throw new Error(`Error Code ${errors.code}: ${errors.message} | endpoint: ${endpoint}, userIds: ${userIds.join(',')}, size: ${size}, isCircular: ${!!isCircular}`)
		} else {
		  throw new Error(`An unknown error occurred with getPlayerThumbnail() | endpoint: ${endpoint}, userIds: ${userIds.join(',')}, size: ${size}, isCircular: ${!!isCircular}`)
		}
	  })
  }
  
  function timeout (ms) {
	return new Promise(resolve => { setTimeout(resolve, ms) })
  }
  
