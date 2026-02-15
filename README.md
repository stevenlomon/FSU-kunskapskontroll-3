# Spotify FindNewMusic Applikation

## Dag 1
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

>This sounds like a rock-solid architectural foundation. As a developer with 15 years in the game, I can tell you that spending this time in the "blueprinting" phase is exactly what separates a >pragmatic developer from someone just hacking things together. You are following the principle of **Design to Code** rather than the other way around.
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

The blueprint phase är viktig! Speciellt om man som mig vill gå in i Systems Design och Architecture! Och jag ska börja en Masters-utbildning inom Computer Science på LiU nästa sommar!

## Dag 2
<img width="2880" height="1720" alt="Screenshot from 2026-02-10 12-41-31" src="https://github.com/user-attachments/assets/52f04dc7-9075-4335-aaed-2bdfe98db834" />
<img width="2880" height="1720" alt="Screenshot from 2026-02-10 12-41-43" src="https://github.com/user-attachments/assets/05480b34-05fb-4ed2-83ee-de1f6bb0146d" />

Spotify tillåter inte en att skapa appar hos de för tillfället 🙃 Se bild 1. Jag litar på, efter att ha läst texten på bild 2, att jag kommer kunna göra det imorgon 11 feb. Tillsvidare! Kommer jag skapa en egen dummy backend. Jag kommer ge 5 stycken AI-byggda Python FastAPI Backends som jag byggt senaste året för Gemini to model, samt hur datan från Spotify's riktiga API ser ut. Detta är inte del av uppgiften alls så det kommer bli en enda prompt och jag accepterar *helt* att det blir potentiellt AI slop. Den behöver inte vara secure över huvud taget, jag kopplar till den lokalt över localhost. Mina Python Backends ligger i en mapp nu och min prompt kommer ligga i sin egna txt fil. Min Dummy backend kommer skrivas i TS så får jag se hur det ser ut. Jag försökte att sätta mig in i TypeScript och att skriva om ClarityTracking Backenden i TS förra året men nothing that stuck around. Ser fram emot att göra det i år; skriva om alla dessa Python Backends i TS och faktiskt sätta mig in i och förstå de djupt!

<img width="2880" height="1720" alt="Screenshot from 2026-02-10 13-37-31" src="https://github.com/user-attachments/assets/2f4ff2c9-b7a6-42a8-897f-8b048d7127dd" />
Beautiful 🌱✨

All kod i PR#1 är skrivet i Antigravity

## Dag 3
Tracklade på med kod i Antigravity, fick en hel del gjort. Och på kvällen; vi har tillgång till Spotify:s officiella API! Att jobba med imorgon

## Dag 4
Vi måste först autentisera oss. https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
Jag är inte super säker på hur man ska tänka kring min access token när jag väl får den och hur den bör användas i min applikation. När jag använder den nu och testar kan jag he en auth.js för att skapa min access token, spara den och använda den i alla mina API-anrop. Men hur ska jag tänka när en användare surfar in och använder min sida? Ska jag generera en ny access token varje gång ett API-anrop görs?? Ska första gången ett API-anrop görs och en access token inte finns skapa en och se till att denna används tills den blir expired? Ska jag lagra the Access Token i localStorage??? Många frågor här som jag vill ha svar på.
Igår kväll fick jag även en bra idé på vad vi kan ha i de tre drop down menyerna; Genre, Decade och BPM! Dessa blir våra filter utöver sökrutan. Alla kommer ha ca 5-8 options ungefär och värdet på dessa slängs in som en `?genre=` eller `?bpm=` i vår query string till Search endpointen om jag förstår det rätt. Även detta får slängas in i min prompt. Ska bara kolla hur Search-endpointen tar variabler i sin query string...
"q
string
Required
Your search query.

You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.

The artist and year filters can be used while searching albums, artists and tracks. You can filter on a single year or a range (e.g. 1955-1960).
The album filter can be used while searching albums and tracks.
The genre filter can be used while searching artists and tracks.
The isrc and track filters can be used while searching tracks.
The upc, tag:new and tag:hipster filters can only be used while searching albums. The tag:new filter will return albums released in the past two weeks and tag:hipster can be used to return only albums with the lowest 10% popularity.

Example: q=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis"
Yes, vi kan filtrera på decade och genre iaf! Inte BPM unfortunately. Får tänka ut en annan, låta det run in the background så att säga. Och det varkar inte vara `?genre=` eller `?bpm=`, utan snarare `%2520year%3A1990-1999` och `%2520genre%3Arock`. Detta får bli confirmed i min prompt jag skriver. 
En sista grej jag kommer slänga in nu är en somewhat primitiv lösning för random search som har tänkts ut i bakgrunden när har gjort annat. Vi väljer en random bokstav i alfabetet, säg att det blir 'r', låt det bli det enda som kommer efter q, dvs. `q=r` för de första 5 sökresultaten, välj sedan en andra random bokstav i alfabetet och låt det blir för de 5 nästa och sen en sista random bokstav i alfabetet för de 5 sista. Vi kör 15 in total på startsidan, inte 30. Känner att det kan bli overwhelming och för mycket för användaren. Jag låter detta bli lösning 1! Hör vad Gemini har att säga om det. Implementerar det och kanske sen frågar om en mer elegant lösning i mån om tid och brain power. Jag tar allt detta nu under Dag 4 och ger till Gemini! Samma chat som gav mig clarity Dag 1.

Input:

¤¤¤

Hi again! I'm on Day 4 now and I have access to the API! It became available yesterday evening haha. I have a few more reflections and questions I want you to assess and act as a sounding board to.

"""

Vi måste först autentisera oss. https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow

Jag är inte super säker på hur man ska tänka kring min access token när jag väl får den och hur den bör användas i min applikation. När jag använder den nu och testar kan jag he en auth.js för att skapa min access token, spara den och använda den i alla mina API-anrop. Men hur ska jag tänka när en användare surfar in och använder min sida? Ska jag generera en ny access token varje gång ett API-anrop görs?? Ska första gången ett API-anrop görs och en access token inte finns skapa en och se till att denna används tills den blir expired? Ska jag lagra the Access Token i localStorage??? Många frågor här som jag vill ha svar på.

Igår kväll fick jag även en bra idé på vad vi kan ha i de tre drop down menyerna; Genre, Decade och BPM! Dessa blir våra filter utöver sökrutan. Alla kommer ha ca 5-8 options ungefär och värdet på dessa slängs in som en `?genre=` eller `?bpm=` i vår query string till Search endpointen om jag förstår det rätt. Även detta får slängas in i min prompt. Ska bara kolla hur Search-endpointen tar variabler i sin query string...

"q

string

Required

Your search query.



You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.



The artist and year filters can be used while searching albums, artists and tracks. You can filter on a single year or a range (e.g. 1955-1960).

The album filter can be used while searching albums and tracks.

The genre filter can be used while searching artists and tracks.

The isrc and track filters can be used while searching tracks.

The upc, tag:new and tag:hipster filters can only be used while searching albums. The tag:new filter will return albums released in the past two weeks and tag:hipster can be used to return only albums with the lowest 10% popularity.



Example: q=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis"

Yes, vi kan filtrera på decade och genre iaf! Inte BPM unfortunately. Får tänka ut en annan, låta det run in the background så att säga. Och det varkar inte vara `?genre=` eller `?bpm=`, utan snarare `%2520year%3A1990-1999` och `%2520genre%3Arock`. Detta får bli confirmed i min prompt jag skriver. 

En sista grej jag kommer slänga in nu är en somewhat primitiv lösning för random search som har tänkts ut i bakgrunden när har gjort annat. Vi väljer en random bokstav i alfabetet, säg att det blir 'r', låt det bli det enda som kommer efter q, dvs. `q=r` för de första 5 sökresultaten, välj sedan en andra random bokstav i alfabetet och låt det blir för de 5 nästa och sen en sista random bokstav i alfabetet för de 5 sista. Vi kör 15 in total på startsidan, inte 30. Känner att det kan bli overwhelming och för mycket för användaren. Jag låter detta bli lösning 1! Hör vad Gemini har att säga om det. Implementerar det och kanske sen frågar om en mer elegant lösning i mån om tid och brain power. Jag tar allt detta nu under Dag 4 och ger till Gemini!

"""

Keep your output still in English, I'm simply writing in Swedish for the README project journal, I still prefer to think and communicate in English. 

* Point me in the right direction when it comes to the access token and how it serves me to think about its usage

* Confirm or correct my understanding of the query string and how to use it

* Simply affirm that my solution to The "Random" fetch logic Mini Challenge is *a* solution that is viable. It's not the most elegant solution in the world, I'm well aware of that! And don't give me the most elegant solution in the world yet cuz I won't appreciate it yet. Simply affirm, don't give any code!

¤¤¤

Output:

¤¤¤

It’s great to see the progress! Day 4 is usually when the "rubber meets the road" and you start hitting those interesting architectural puzzles.
> 
> Here is my assessment of your reflections:
> 
> 1. The Access Token Strategy
> In the Client Credentials Flow, the token is typically valid for 3600 seconds (1 hour).
> 
> How to think about it: You definitely don't want to generate a new token for every API call. That’s inefficient and will likely get you rate-limited quickly.
> 
> The "Pragmatic" approach: Treat the token as a temporary resource. When your app starts, check if you have a valid token.
> 
> Storage: Storing it in localStorage (or sessionStorage) is perfectly fine for a student project.
> 
> The Lifecycle: A solid pattern is to store the token along with an expiration timestamp (current time + 3600ms). Before making an API call, your "Api Controller" should check: "Is the current time greater than my stored expiration?"
> 
> If yes: Refresh the token first.
> 
> If no: Use the one you have.
> 
> A Note on Security: In a production environment, you would never keep your Client Secret in client-side code (it would be in a backend/proxy). For this assignment, it's acceptable, but keep that "Real World" distinction in mind for your README!
> 
> 2. The Search Query String
> You are on the right track regarding the syntax, but let's refine the "how."
> 
> Syntax: The q parameter is a single string. Filters like genre and year are appended inside that string, separated by spaces.
> 
> Correct format: q=track:SearchTerm genre:rock year:1990-1999
> 
> The BPM Hurdle: You correctly identified that BPM (tempo) is not a filterable field in the Search endpoint. It exists in the Recommendations endpoint, but not in Search.
> 
> Correction on Encoding: You mentioned %2520. Be careful—that is a "double-encoded" space. Usually, a single space is encoded as %20 or +. If you use new URLSearchParams() or encodeURIComponent(), it will handle this for you automatically.
> 
> 3. The "Random" Fetch Logic
> I am officially affirming this solution.
> 
> Is it the most "elegant" in terms of algorithmic efficiency? Perhaps not. However, is it a viable, creative, and functional solution to the problem of "How do I get random data from a structured search engine?" Yes.
> 
> Why it works: It breaks the "static" feel of a search-based app.
> 
> The Trade-off: As you noted, it might require multiple calls to get your full list of 15. From a "Pragmatic" view, this is a classic Trade-off: You are trading a bit of network traffic for a much better user experience.
> 
> It's a clever "hack" (in the best sense of the word) to get variety without having to dive into more complex endpoints. Stick with it for Lösning 1!
> 
> 4. Refined Drop-down Plan
> Since BPM is out for the Search endpoint, you have an opportunity to swap it for something else supported by q, such as:
> 
> tag:new (Great for a "Fresh Finds" feel).
> 
> tag:hipster (Spotify’s actual tag for low-popularity "indie" tracks).
> 
> Artist/Album specific filters.
> 
> Next Step
> Would you like to discuss how to structure your TypeScript Interfaces for the Spotify API response so that your DataStore stays type-safe?

¤¤¤

Let's get going 🚀

# Day 6
Vi.. we didn't get going very far så att säga haha. Inte en enda commit igår pga circumstances. Men jag har en klar bild av vad jag behöver göra nu. Ska bli klar med denna PR, merge it, och sen tacklar jag the inevitable TypeScript re-factor innan jag skriver resten i TypeScipt

# Day 7
Final day!! Igår blev ändå TypeScript och mycket annat klart. Det sista som hände dock...

<img width="1798" height="1006" alt="Screenshot from 2026-02-15 09-40-09" src="https://github.com/user-attachments/assets/7dc8ba22-1abb-4540-aed2-81c70312c83b" />

Var att the rimit blev hit. Så idag ska jag använda min dummy backend så mycket som möjligt tills jag *måste* testa något med det riktiga API:t. Låter vettigt. Let's go!

...

11:02. Fick precis till duration_ms conversion. Om man kollar på mina challenges som jag satt upp i början av projektet:
"So the identified little mini challenges will be:

Fetch 30 random songs for the app front page
"Songs like these" functionality when in Detailed View for a track
Function to convert duration in milliseconds to the standard "3:28 format" (3m 28s)
Spinning vinyl disc as the loading UI when the API is "thinking"
How to remove what is in localStorage after 24 hours
What else to store in localStorage?
TypeScript"
* Vi kör inte 30 utan 10 haha men check ✅
* "Songs like these" functionality when in Detailed View for a track. Nej. Skräpar detta.
* Function to convert duration in milliseconds to the standard "3:28 format" (3m 28s). Check ✅
* Spinning vinyl disc as the loading UI when the API is "thinking". Check ✅
* "How to remove what is in localStorage after 24 hours". Right. Den här ska jag kolla lite på.
* "What else to store in localStorage?". Direkt kopplat till filtrena! Vilket blir det jag ska tackla nu här näst
* TypeScript. Check ✅

Let's go 🚀

...

18:06. KLAAAARRRRRRRRRRRRRR!!!!!!!
Det blev matigt nu sista timmarna. Det blev det. Det är så mycket jag vill dyka in i och förstå och implementera. Debouncing och att rensa localStorage efter 24h bara för att nämna två utav dem. Det är så mycket av det jag gjort nu för första gången som kommer marinera in the back of my mind också som jag verkligen ser fram emot att stärka ju mer jga gör det!

Men jag är supernöjd med detta jag nu lämnar in! 🚀
