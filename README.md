# Spotify FindNewMusic Applikation
Jag tänker använda Spotifys API för att bygga ut en sida som visar ca 30 random låtar på startsidan med sökfunktionalitet och en "Re-shuffle" knapp för att "shuffla" fram nya random låtar. Denna lilla lista på ca 30 låtar blir the "List view" (första anropet). Och när man klickar på en låt går man till "Detailed view" (andra anropet). Om Spotify gör det lätt kan man säkert lägga till "Songs like these" när man är i detailed view. Sidan kommer stylas med AI som skriver CSS efter prompts. Kommer satsa på typ "minimalistic, sleek, modern but still fun" feel

Till att börja med fick jag en klar förståelse för helhetsbilden av uppgiften i stort (jag går för VG för jag vill lära mig och förstå så mycket som möjligt! 🙌), API:t, genom att skriva med Gemini Pro i Thinking Mode som bollplank. 

Följande prompt är min input (tog ca 30 minuter att skriva haha):
Hi! You are a Full Stack Developer with 15 years of development. We are going to discuss an assignment! I'm attaching it as a PDF.

The API I've chosen is the official Spotify API! I've currently written this in the README for the private repo for the repo:

"Jag tänker använda Spotifys API för att bygga ut en sida som visar ca 30 random låtar på startsidan med sökfunktionalitet och en Random knapp för att "shuffla".
Denna lilla lista på ca 30 låtar blir the "List view" (första anropet). Och när man klickar på en låt går man till "Detailed view" (andra anropet).
Om Spotify gör det lätt kan man säkert lägga till "Songs like these" när man är i detailed view.
Sidan kommer stylas med AI som skriver CSS efter prompts. Kommer satsa på typ "minimalistic, sleek, modern but still fun" feel"

I want to discuss the task at hand from an architectural view and get a good grasp of it before I do my best to code it almost exclusively with prompts in Antigravity.

To start of,

"Getting started

This is where the magic begins! The following steps will help you to get started with your journey towards creating some awesome music apps using the API:
Log into the dashboard using your Spotify account.
Create an app and select "Web API" for the question asking which APIs are you planning to use. Once you have created your app, you will have access to the app credentials. These will be required for API authorization to obtain an access token.
Use the access token in your API requests.
You can follow the Getting started tutorial to learn how to make your first Web API call."

To start of, it seems we simply log in using my personal Spotify account to the dashboard, create an app (where I will most likely state my intent; I'll say I'm simply creating a full stack student project for an assignment, it won't be monetized in any way shape of form), and once we have app credentials and use it get our hands on an access token, this is what we need to use in the header of all our API calls?

The Search endpoint is the one I will use the most I believe:

¤¤¤
Web API •

References / Search / Search for Item

Search for Item


OAuth 2.0

Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks that match a keyword string. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.


Important policy note

Spotify content may not be used to train machine learning or AI model

Request

GET

/search

q

string

Required

Your search query.

You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.

The artist and year filters can be used while searching albums, artists and tracks. You can filter on a single year or a range (e.g. 1955-1960).

The album filter can be used while searching albums and tracks.

The genre filter can be used while searching artists and tracks.

The isrc and track filters can be used while searching tracks.

The upc, tag:new and tag:hipster filters can only be used while searching albums. The tag:new filter will return albums released in the past two weeks and tag:hipster can be used to return only albums with the lowest 10% popularity.

Example: q=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis

type

array of strings

Required

A comma-separated list of item types to search across. Search results include hits from all the specified item types. For example: q=abacab&type=album,track returns both albums and tracks matching "abacab".

Allowed values: "album", "artist", "playlist", "track", "show", "episode", "audiobook"

market

string

An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.

If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.

Note: If neither market or user country are provided, the content is considered unavailable for the client.

Users can view the country that is associated with their account in the account settings.

Example: market=ES

limit

integer

The maximum number of results to return in each item type.

Default: limit=20

Range: 0 - 50

Example: limit=10

offset

integer

The index of the first result to return. Use with limit to get the next page of search results.

Default: offset=0

Range: 0 - 1000

Example: offset=5

include_external

string

If include_external=audio is specified it signals that the client can play externally hosted audio content, and marks the content as playable in the response. By default externally hosted audio content is marked as unplayable in the response.

Allowed values: "audio"

Response

200

401

403

429

Search response

  

tracks

object

href

string

Required

A link to the Web API endpoint returning the full result of the request

Example: "https://api.spotify.com/v1/me/shows?offset=0&limit=20"

limit

integer

Required

The maximum number of items in the response (as set in the query or by default).

Example: 20

next

string

Required

Nullable

URL to the next page of items. ( null if none)

Example: "https://api.spotify.com/v1/me/shows?offset=1&limit=1"

offset

integer

Required

The offset of the items returned (as set in the query or by default)

Example: 0

previous

string

Required

Nullable

URL to the previous page of items. ( null if none)

Example: "https://api.spotify.com/v1/me/shows?offset=1&limit=1"

total

integer

Required

The total number of items available to return.

Example: 4

  

items

array of TrackObject

Required
¤¤¤

`type` will exclusively be `track` for this app.

I will use `SE` as market to keep the search results Swedish-based.

For the start page, a limit of 30 will be used, let's start with that. 5 across, 6 down. That sounds reasonable and not too overwhelming. I'm not going to have a "Load more" and enable "infinite scrolling". There are strictly 30 tracks on the start page and to generate 30 new random tracks, the user needs to press "Re-shuffle" (button text subject to change haha). I will need to find a way to fetch 30 random songs for the front page!

"The index of the first result to return. Use with limit to get the next page of search results." If we're going for filtering (search) *and* pagination for VG, we would use `limit` in combination with `index` I assume? Simply confirm or tell me if I'm completely wrong! I want to reflect on the implementation myself first and forement. If so, this would not be for the front page, only for search results

We will exclude `include_external`.

As for the `tracks`response, the data we are interesting in are in the items array!

¤¤¤
items

array of TrackObject

Required

album

object

The album on which the track appears. The album object includes a link in href to full information about the album.

artists

array of SimplifiedArtistObject

The artists who performed the track. Each artist object includes a link in href to more detailed information about the artist.

available_markets

array of strings

Deprecated

A list of the countries in which the track can be played, identified by their ISO 3166-1 alpha-2 code.

disc_number

integer

The disc number (usually 1 unless the album consists of more than one disc).

duration_ms

integer

The track length in milliseconds.

explicit

boolean

Whether or not the track has explicit lyrics ( true = yes it does; false = no it does not OR unknown).

external_ids

object

Deprecated

Known external IDs for the track.

external_urls

object

Known external URLs for this track.

href

string

A link to the Web API endpoint providing full details of the track.

id

string

The Spotify ID for the track.

is_playable

boolean

Part of the response when Track Relinking is applied. If true, the track is playable in the given market. Otherwise false.

linked_from

object

Deprecated

Part of the response when Track Relinking is applied, and the requested track has been replaced with different track. The track in the linked_from object contains information about the originally requested track.

restrictions

object

Included in the response when a content restriction is applied.

name

string

The name of the track.

popularity

integer

Deprecated

The popularity of the track. The value will be between 0 and 100, with 100 being the most popular.

The popularity of a track is a value between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.

Generally speaking, songs that are being played a lot now will have a higher popularity than songs that were played a lot in the past. Duplicate tracks (e.g. the same track from a single and an album) are rated independently. Artist and album popularity is derived mathematically from track popularity. Note: the popularity value may lag actual popularity by a few days: the value is not updated in real time.

preview_url

string

Nullable

Deprecated

A link to a 30 second preview (MP3 format) of the track. Can be null

  

Important policy note

Spotify Audio preview clips can not be a standalone service

track_number

integer

The number of the track. If an album has several discs, the track number is the number on the specified disc.

type

string

The object type: "track".

Allowed values: "track"

uri

string

The Spotify URI for the track.

is_local

boolean

Whether or not the track is from a local file.
¤¤¤

We will display `album`, `artists`, `duration_ms` (with some sort of function to convert this to the format we all are used to, i.e 3:28 for 3m 28s), `explicit`, and `name`. `id` will be used for the API calls.

The API has their own error messages for 401, 403 and 429 that I will display when relevant in the try/catch block.


I'm attaching two JS files.

The first one is my last assignment for this course. It's the most orthogonal system I've built and currently my own golden standard for code. I look forward to my golden standard expanding with this assignment! I'm assigning this one as script.js

The second one is a simple application I built as an exercise that contains our desired functionality. It is also built with the first script in mind system and refactoring wise. It is being attached as a temporarily renamed script2.js

  I'm thinking of following the system structure of script2.js as much as possible:
DataStore object for all data acting as our truth.
The "Api Controller" section will be modularized! fetchAll() and fetchById(trackId) will both be exported into a new module api.js that we'll import! We learned about this today haha
ViewRenderer for all the rendering. It will have a renderList and a renderDetailed method. I will have to think about what I want to display when the API is "thinking". What immediately came to mind is a vinyl disc, that would be cool!
init() function, eventListener on the main container with Event Delegation and finally connect the init function to window in a DOMContentLoaded EventListener.

I'm thinking of "caching" the list of 30 songs in localStorage! So that 1. we don't have to make a new API call everytime the user goes back to List Mode, but also 2. so that the same 30 songs appear! This is wiped and re-stored when the user hits Re-shuffle and after 24 hours. This I will also have to think about how to implement. I'll also think about what else I can store in localStorage.

I'll also figure out how to write TypeScript haha!

  I'm also attaching The Pragmatic Programmer as a reference that I've followed to write my code as pragmatic as possible, following principles and paradigms. Please refer to it whenever it makes sense to do so here

  So the identified little mini challenges will be:
* Fetch 30 *random* songs for the app front page
* "Songs like these" functionality when in Detailed View for a track
* Function to convert duration in milliseconds to the standard "3:28 format" (3m 28s)
* Spinning vinyl disc as the loading UI when the API is "thinking"
* How to remove what is in localStorage after 24 hours
* What else to store in localStorage?
* TypeScript

Don't give any hints or code for these! Simply affirm.

This sounds like a plan!

*NO CODE*! No code generation here in this chat. *IMPORTANT*. This is *strictly* for you to act as a sounding board (fitting name with the Spotify API haha!) and for me to get a good grasp of the assignment ahead of me!

Let's dive in 🌱

Det här är Gemini's output:

This sounds like a rock-solid architectural foundation. As a developer with 15 years in the game, I can tell you that spending this time in the "blueprinting" phase is exactly what separates a pragmatic developer from someone just hacking things together. You are following the principle of **Design to Code** rather than the other way around.
> 
> Here is a breakdown of your architectural plan from a high-level perspective:
> 
> ### 1. Authentication & The Spotify Flow
> 
> Your understanding of the Spotify Dashboard is spot on. You’ll be using the **Client Credentials Flow**, which is perfect for this type of server-to-server (or in your case, client-to-API) request where user-specific private data (like their playlists) isn't needed.
> 
> - **The Access Token:** You are correct that this goes into the `Authorization` header as a `Bearer` token.
>     
> - **The Intent:** Spotify is generally very developer-friendly for student projects. As long as you aren't selling the data or claiming it's your own, you're golden.
>     
> 
> ### 2. The Search Endpoint & Pagination
> 
> Using the `search` endpoint as your primary engine is a smart move.
> 
> - **VG Criteria:** Regarding the `limit` and `offset`, you hit the nail on the head. To satisfy the "pagination" requirement for your VG grade, `offset` is your primary tool. If your `limit` is 30, then page 1 is `offset=0`, page 2 is `offset=30`, and so on.
>     
> - **Market Filtering:** Using `market=SE` is a great way to ensure the data is relevant to your local context.
>     
> 
> ### 3. Application Structure (The "Golden Standard")
> 
> I like that you are sticking to the **Separation of Concerns** (SoC) seen in your previous scripts.
> 
> - **Api Controller (api.ts):** Moving this to a module is a "Pragmatic" move. It keeps your main logic clean and makes the API interaction a black box that just hands over data.
>     
> - **DataStore:** This acts as your **Single Source of Truth**. By having the `ViewRenderer` depend on the `DataStore` rather than the API directly, you make the app much easier to debug.
>     
> - **Event Delegation:** Using a single listener on the main container (as seen in `script2.js`) is highly efficient and prevents memory leaks that can happen with hundreds of individual listeners.
>     
> 
> ![Image of Model-View-Controller architecture](https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRM_grnQUTXBiimEAqrm3HVge1SepwxLorBSZtqQxKsVn22iAjiJ9b69Bsyc4XZGTrUYU7k2hdgw0kvaJPjFTE0Uievf60RGRw8FwJf0bi7SU_SIEY)
> 
> ### 4. LocalStorage & Persistence
> 
> Your plan for "caching" is a classic performance optimization.
> 
> - **Ortho-consistency:** By storing the list, you ensure that "Go Back" doesn't trigger a new random fetch, which would be jarring for a user.
>     
> - **The 24-hour limit:** This is a great exercise in state management and handling "stale" data.
>     
> 
> ### 5. Addressing the "Mini Challenges"
> 
> I’ve noted your specific list of challenges. I won't provide code or hints, but I will affirm that these are perfectly scoped for a VG-level assignment:
> 
> - The "Random" fetch logic.
>     
> - The "Songs like these" (Related content) logic.
>     
> - The data formatting (ms to 0:00).
>     
> - The UX/UI loading state (the spinning vinyl).
>     
> - The Cache invalidation logic (localStorage expiry).
>     
> - The TypeScript implementation.
>     
> 
> ### 6. The Pragmatic Approach
> 
> By aiming for **Orthogonality** (as mentioned in _The Pragmatic Programmer_), you’re ensuring that changing your CSS or your UI doesn't break your API logic. Since you are using Antigravity and prompts, keeping these modules strictly separated will make it much easier to "guide" the AI without it creating a "big ball of mud."
> 
> **One final thought for your architectural "grasp":** Since you are moving to TypeScript, think about your **Interfaces** early. Defining what a `Track` looks like before you write a single function will act as the contract for your entire app.
> 
> This plan is comprehensive and aligns perfectly with the assignment requirements. You've clearly identified where the complexity lies and how to structure the solution to handle it.
> 
> Ready to dive into the first phase of the build?
