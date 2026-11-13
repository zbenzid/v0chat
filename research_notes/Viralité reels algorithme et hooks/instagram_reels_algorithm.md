# Instagram Reels ranking / recommendation algorithm (state as of Nov 2026)

> **Method and reliability note (read first).** In this session every direct page fetch failed (hosts outside the session's network allow-list: `creators.instagram.com`, `transparency.meta.com`, `socialmediatoday.com`, `buffer.com`; `instagram.com` itself is also blocked). All findings below therefore come from **web-search result summaries**, not from pages I opened. Primary URLs (Meta / Instagram) are cited when the search engine surfaced them directly; otherwise the secondary page that quotes the primary is cited. Quotes are reproduced as the search results reported them and have **not been checked verbatim against the original post or video**.
>
> Labels used on every claim:
> - **OFFICIAL** = statement by Meta / Instagram / Adam Mosseri / @creators (suffix "via secondary" when I only have it through trade press or a blog).
> - **DATA STUDY** = quantitative analysis by a named analytics vendor.
> - **PRACTITIONER OPINION** = blog / agency inference with no primary source.
>
> Items dated after June 2026 (notably Mosseri's September 2026 ranking series and the June 2026 "Your Algorithm" expansion) rest on search results only and deserve a manual check on Mosseri's profile before being hard-coded in a checklist.

---

## 1. Which signals has Mosseri / Instagram officially named as most important for Reels (2024, 2025, 2026)? Followers vs non-followers?

### Takeaway
The only officially named "top three" is **watch time, likes per reach, sends (DM shares) per reach** (Mosseri, Jan 2025), with likes weighing *slightly* more for followers ("connected") and sends *slightly* more for non-followers ("unconnected"). No official weight, multiplier or numeric threshold has ever been published; every "a send = 3-5x a like" figure is practitioner inference.

### Cited Findings

**2023 baseline (older than 2024, possibly outdated, but still the last full official written explainer)**
- OFFICIAL (via secondary). Mosseri's "Instagram Ranking Explained" post (31 May 2023) lists the key Reels predictions as how likely a viewer is to watch a reel all the way through, like it, reshare it, and go to its audio page. Signal families: the viewer's activity, the viewer's history with the poster, information about the reel (audio, visuals, popularity), information about the poster. Instagram lists signals roughly in order of importance and publishes no weights. — [MeetEdgar summary](https://meetedgar.com/blog/how-instagram-and-facebook-decide-what-to-show); [Fridai summary](https://fridai.fansnetwork.ai/en/blog/instagram-algorithm-2026); primary (not opened): https://about.instagram.com/blog/announcements/instagram-ranking-explained
- OFFICIAL (via secondary). One French source notes this written ranking post has not been updated since 2023; later guidance comes from Mosseri videos and @creators posts. — [Adaptlypost FR](https://adaptlypost.com/fr/blog/instagram-reels-algorithm)

**2024**
- OFFICIAL (via secondary). July 2024 Mosseri reel: sends per reach is "one of the most important" signals Instagram uses (reported as quoted and embedded by Search Engine Journal). — [ad2.app compilation of official statements](https://ad2.app/blog/instagram-algorithm-in-instagrams-own-words); [Creator Lane](https://creatorlanehq.com/blog/instagram-algorithm-2026-mosseri-vs-measured)
- OFFICIAL (via secondary). Widely repeated attribution that Mosseri called sends per reach "the single most important" signal; one source explicitly notes this stronger wording is "widely attributed" to a Mosseri video but not verifiable. Treat "one of the most important" as the safe wording. — [RecurPost](https://blog.recurpost.com/?p=22)

**2025 (the key statement)**
- OFFICIAL (via secondary). Mosseri, 22 January 2025 (video): "The top three signals that matter most for ranking are watch time, likes and sends. So when looking at your insights, pay close attention to average watch time, likes per reach, and sends per reach." — [Social Media Today](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/)
- OFFICIAL (via secondary). Same video: "Likes are slightly more important for connected content, and sends are slightly more important for unconnected content." (connected = followers, unconnected = non-followers / recommendations). — [Social Media Today](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/); French coverage dated 23 Jan 2025: [Siècle Digital](https://siecledigital.fr/2025/01/23/les-secrets-de-lalgorithme-sur-instagram-en-2025-reveles-par-adam-mosseri/)
- OFFICIAL (via secondary, French). Blog du Modérateur's 2025 recap gives the same hierarchy: for followers watch time, then likes, then shares; for non-followers shares rank before likes. It adds that Instagram revised how average watch time is computed after lengthening Reels so that longer videos are not penalised. — [Blog du Modérateur, algorithme 2025](https://www.blogdumoderateur.com/instagram-algorithme-2025/); [Blog du Modérateur, critères clés 2025](https://www.blogdumoderateur.com/algorithme-instagram-criteres-cles-en-2025/)
- OFFICIAL (via secondary). Mosseri on what to track: "Sends, reach, and views are the most important metrics for anybody trying to understand how their content is doing on Instagram." Views = "the number of times a reel started to play or replay" (so replays add to views). — [Metricool, Mosseri Insights updates](https://metricool.com/instagram-insights/)
- OFFICIAL (via secondary). Mosseri in an Instagram reel about hooks: "The first three seconds of a reel are super important", and a hook does not require baiting people. Originating page not pinned down in this session; surfaced in a result set that included the Hootsuite algorithm guide. — [Hootsuite](https://blog.hootsuite.com/instagram-algorithm/)

**2026**
- OFFICIAL (via secondary). 24 September 2026: Mosseri published a multi-part video series "demystifying" ranking. He describes ranking as systematic predictions of how a user will respond to a post (likely to watch it, share it with a friend, etc.), points to user controls (Favorites, "Not interested"), and says trial reels can be beneficial. — [Social Media Today, 24 Sep 2026](https://www.socialmediatoday.com/news/instagram-chief-shares-algorithm-insights-and-posting-tips/831326/)
- OFFICIAL (via secondary). The series names four principles: (1) **originality** (the original creator is weighted above re-posters), (2) **recency** (newer posts get more exposure), (3) **"breaking" content from small creators** (public posts from small accounts are shown to non-followers to gauge reaction), (4) **larger AI models** weighing more signals across more posts. — [Parasocial Magazine](https://www.parasocialmagazine.com/news/mosseri-names-four-instagram-ranking-principles-for-creators/); [Firebelly Media](https://firebellymedia.co.uk/news/instagram-algorithm-mosseri-originality-recency/); [Bazzaal](https://www.bazzaal.com/blog/instagram-algorithm-2026-mosseri)
- OFFICIAL (via secondary). In the same series Mosseri reportedly advised tracking engagement **rate** rather than total views or likes. — [Younus Fardeen](https://younusfardeen.in/blog/instagram-ranking-principles-mosseri-content-plan)
- OFFICIAL (via secondary). A 2026 restatement of the three signals, each framed "per reach". — [Kompozy](https://kompozy.io/news/instagram-mosseri-ranking-signals-guidance)

**Meta Transparency Center system cards**
- OFFICIAL (primary URL surfaced, content partly unreadable). The "Instagram Reels Chaining AI system" card describes a pipeline: gather candidate reels, weigh input signals about each, apply integrity processes, make predictions; reels predicted to provide more value are shown sooner. Models and input signals "are dynamic and they change frequently". — [Meta Transparency Center](https://transparency.meta.com/features/explaining-ranking/ig-reels-chaining/)
- OFFICIAL (via secondary). Predictions reported from the Reels card: watch to the end, like, reshare, visit audio page; also watch less than three seconds, comment, share off Instagram, follow the author, reuse the reel's audio. Input signals reported include whether the viewer has been watching reels for more than 15 seconds and clicks on the audio link. — [Fridai](https://fridai.fansnetwork.ai/en/blog/instagram-algorithm-2026); [Later](https://later.com/blog/instagram-reels-algorithm/)
- OFFICIAL (via secondary). Meta says it avoids disclosing signals that would make it easier to circumvent its defences, which is why no full weighted list exists. — [Meta Newsroom, June 2023](https://about.fb.com/news/2023/06/how-ai-ranks-content-on-facebook-and-instagram/)

**What is NOT official**
- PRACTITIONER OPINION. "A send is worth 3-5x a like" (or 15x on Reels) appears only in secondary blogs, never in a Mosseri quote. Buffer explicitly advises treating any precise multiplier with suspicion. — [SocialDay](https://socialday.live/features/instagrams-dm-share-signal-now-drives-3-to-5-times-more-reach-than-likes); [Creator Lane](https://creatorlanehq.com/blog/instagram-sends-per-reach-2026); [Buffer](https://buffer.com/resources/instagram-algorithms/)
- PRACTITIONER OPINION. "Watch time is the single strongest signal" is interpretation; Instagram publishes no watch-duration cut-off. — [SocialPilot](https://www.socialpilot.co/blog/instagram-reels-algorithm)
- PRACTITIONER OPINION. Claims that 2026 priority goes to prolonged watch time, DM sends and replays, and that Mosseri called a DM send the most valued signal, could not be traced to a primary source. — [Value Your Network FR](https://www.valueyournetwork.com/signaux-algorithme-instagram/)

### Inferences
- For a script-QC checklist aimed at **non-follower reach**, the officially supported optimisation targets are, in order of evidential strength: (a) hold in the first 3 seconds (it is both a named prediction, "watch less than 3 seconds", and the skip-rate metric), (b) average watch time / completion, (c) "sendability" (would a viewer DM this to a specific person), (d) likes. Saves and comments are real predictions but have never been placed in the official top three for Reels.
- Because all three top signals are expressed **per reach**, a script should be judged on the rate it earns from whoever sees it, not on raw volume; a narrow, highly sendable idea can outperform a broad, mildly liked one.
- Rewatches are officially counted in views (start or replay) and practitioners assume they add watch time, but "rewatches" as a separately named top signal is not officially confirmed.

### Gaps
- I could not open Mosseri's Jan 2025 and Sept 2026 videos or the Reels system card; exact verbatim wording and the full prediction list need a manual check.
- No official statement found ranking **saves** or **comments** for Reels in 2025-2026.
- No official numeric thresholds exist for watch time, completion, likes per reach or sends per reach.

---

## 2. What does Instagram say about originality, watermarks, low resolution, muted audio, length limits, political content and Recommendation Guidelines eligibility?

### Takeaway
Eligibility is a gate before ranking: a Reel must pass the Recommendations Guidelines (stricter than Community Standards), be original, be 3 minutes or less, and avoid the listed quality defects (watermarks/logos, borders, blur/low resolution, muted, mostly text) to be recommended to non-followers. Originality enforcement tightened twice: 30 April 2024 (Reels) and 30 April 2026 (extended to photos and carousels).

### Cited Findings

**Quality defects that reduce recommendation**
- OFFICIAL (primary URL surfaced). Help Center, "What kind of reels you may see on Instagram": Instagram favours reels using music from the Instagram music library or original audio made with the Reels audio tool, and filmed vertically. Reels may be less visible if they are "muted, blurry, or low resolution", "contain borders, logos, or watermarks", "have the majority of the image covered by text", or "are not original videos". Reels from accounts you follow are still shown on the profile and in feed (the demotion concerns recommendations). — [Instagram Help Center](https://help.instagram.com/1525585517644948/?helpref=related_articles%3D)
- OFFICIAL (via secondary, 2023, older). Mosseri's 2023 post lists the same reduced-visibility reasons: low-resolution or watermarked reels, muted reels or reels with borders, majority-text reels, reels already posted on Instagram. — [New Media Dispatch](https://newmediadispatch.com/platforms/how-instagram-decides-which-reels-you-see)
- OFFICIAL (via secondary, 2021, older). Instagram first said in February 2021 that reels with visible watermarks/logos from other apps (TikTok) would be recommended less. — [GSMArena](https://m.gsmarena.com/newscomm-47671.php)

**Originality (30 April 2024)**
- OFFICIAL. Four changes announced 30 April 2024: reposts replaced by the original in recommendations; reposts labelled with a link to the original creator; aggregators removed from recommendations; a ranking change giving smaller creators more distribution. — [Instagram Creators blog](https://creators.instagram.com/blog/recommendations-and-originality); coverage: [MediaPost](https://www.mediapost.com/publications/article/414773/instagram-algorithm-update-deprioritizes-unorigina.html); [Gigazine](https://www.gigazine.net/gsc_news/en/20240502-instagram-updated-algorithm-prioritizes-original-content)
- OFFICIAL. Aggregator threshold in the 2024 rule: accounts reposting others' content 10 or more times in 30 days lose recommendation eligibility and regain it when they fall below that threshold. — [Instagram Creators blog](https://creators.instagram.com/blog/recommendations-and-originality)
- OFFICIAL (via secondary). Replacement happens only when the original is "relatively new" and the system is confident posts are identical "based on audio and visual signals"; publishers with licensing agreements or explicit creator permission are exempt; changes apply to recommendations only, not to followers' feeds. Mosseri conceded identifying originality "is hard" and will be iterated. — [cti digital](https://ctidigital.com/insights/instagram-update-impact-on-re-posting-and-user-generated-content/); [iMusician](https://imusician.pro/en/resources/blog/instagram-is-changing-its-algorithm-focusing-on-more-original-content)
- PRACTITIONER OPINION (quoting Instagram). Adding a watermark, border, subtitles or a caption credit does not make content original; the rule targets reposting without material changes. — [Wonderworks Design](https://wonderworksdesign.net/guide/instagram)

**Originality (30 April 2026 extension)**
- OFFICIAL. "Rewarding original creators on Instagram": originality guidelines extended to photos and carousels. Accounts that mainly post unoriginal photos, carousels or Reels will no longer be shown where Instagram recommends content. Does not affect what followers see. Aggregators regain eligibility when most of their recently posted content is original in a 30-day period. — [Instagram Creators blog](https://creators.instagram.com/blog/rewarding-original-creators-on-instagram); [Tubefilter, 30 Apr 2026](https://tubefilter.com/2026/04/30/instagram-removes-algorithm-recommendations-repost-content-aggregator); [PetaPixel, 30 Apr 2026](https://petapixel.com/2026/04/30/new-instagram-policies-target-reposted-content/)
- OFFICIAL (via secondary). Mosseri: aggregators are "an important part of the ecosystem" but must adapt: "Remix the content… Make it your own." Reported figure: 75% of US recommendations now come from original posts. — [Planoly](https://planoly.com/blog/instagram-updates-its-original-content-policy); [WebProNews](https://www.webpronews.com/instagrams-aggregator-purge-original-creators-gain-ground-as-repost-empires-crumble/)
- PRACTITIONER OPINION. Voice-over, green screen, own commentary/text, or a Collab with the original are cited as acceptable transformations (attributed to Mosseri by a newsletter, unverified). — [Post Planner via Milled](https://milled.com/postplanner/igs-new-30-day-rule-will-kill-50-of-accounts-ejL99Dh0UIX5mqVE)
- OFFICIAL (via secondary). September 2026: Mosseri again lists originality as a ranking principle; the same video posted by a re-poster starts from a weaker position than the creator's original. — [Exemplary AI](https://exemplary.ai/blog/instagram-algorithm-original-content)

**Length**
- OFFICIAL. "Finding success on reels in 2025" (21 January 2025): reels up to 3 minutes can now reach non-followers on the Reels tab and Explore; previously the recommendation limit was 90 seconds. Also: audio layering credits the mix to the creator; photos/carousels with audio can enter the Reels tab. — [Instagram Creators blog](https://creators.instagram.com/blog/the-latest-with-instagram); coverage: [Social Media Today](https://www.socialmediatoday.com/news/instagram-reels-tips-3-minutes-unfiltered-nyc/741722/); [Lindsey Gamble](https://www.lindseygamble.com/blog/instagram-three-minute-reels)
- OFFICIAL (via secondary). In 2026 the app lets creators record/edit Reels up to 20 minutes, but "Reels over 3 minutes won't be recommended to new audiences" (attributed to the Help Center). Rollout described as gradual; sources disagree on upload limits. — [CreatorFlow](https://creatorflow.so/blog/how-long-can-instagram-reels-be/); [Kommia](https://kommia.com/en/blog/duree-reel-instagram.html)

**Recommendations Guidelines / account eligibility**
- OFFICIAL (via secondary). Help Center: "our Recommendations Guidelines are designed to maintain a higher standard than our Community Standards". Content that falls short stays up and visible to followers but is excluded from Explore, Reels, feed recommendations, Search and Suggested Accounts. — [NoobClaw explainer](https://noobclaw.com/blog/instagram-recommendation-guidelines-explained-2026/)
- OFFICIAL (via secondary). "If your account is not eligible to be recommended, none of your content will be recommended regardless of whether or not all of your content goes against our Recommendations Guidelines." Status is visible in Settings under Account Status. — [Intellicoach](https://intellicoach.ai/blog/instagram-not-eligible-for-recommendations-non-followers); [Lilach Bullock](https://www.lilachbullock.com/instagram-reel-not-eligible-for-recommendation/)

**Political content**
- OFFICIAL (via secondary). February 2024: Instagram and Threads stopped proactively recommending political content from accounts users do not follow (Reels, Explore affected); users had to opt in. — [Yahoo/NBC coverage](https://www.yahoo.com/tech/creators-theyre-frustrated-instagram-starts-202906455.html)
- OFFICIAL (via secondary). 8-9 January 2025: Mosseri reversed this. Political content is recommended again with three user levels (less, standard as default, more), US first then other markets; he said drawing a line around what is political proved impractical. — [Business Today, 9 Jan 2025](https://www.businesstoday.in/technology/news/story/threads-and-instagram-will-recommend-political-content-now-says-adam-mosseri-460084-2025-01-09); [Deccan Chronicle](https://www.deccanchronicle.com/technology/instagram-and-threads-to-recommend-political-content-1853016)

### Inferences
- Pre-publication hard checks that follow directly from official text: no third-party watermark or logo, no border/letterboxing, vertical framing, sharp export, audible audio track (not muted), on-screen text not covering most of the frame, duration 3:00 or less, footage that is the creator's own or materially transformed.
- "Majority of the image covered by text" matters for script QC of text-heavy formats (quote reels, text-over-b-roll): keep overlays to a minority of the frame.
- Political topics are no longer suppressed by default since January 2025, but viewers who chose "less" will not be recommended them.

### Gaps
- The Recommendations Guidelines page itself (categories such as sensitive health claims, clickbait, engagement bait, contests) was not readable here; a QC checklist should be checked against the live Help Center text.
- Claimed follower minimums for recommendation eligibility (200 for professional, 1,000 for personal accounts) appear only in blogs and are unverified.
- Whether AI-generated content labels affect Reels distribution: no reliable source found in this session.

---

## 3. How does audience-testing staging work? What is Trial Reels? How do small accounts get reach?

### Takeaway
Instagram officially describes a tiered test: a new Reel goes to a small audience likely to enjoy it (followers or not), the best performers go to a slightly wider group, and so on. Trial Reels (launched 10 December 2024) lets a creator run that test on non-followers only, with optional auto-share to followers based on the first 72 hours of views. The size of the seed audience has never been published.

### Cited Findings
- OFFICIAL (via secondary quoting the 30 April 2024 Creators blog). A reel is shown to "a small audience of people we think will enjoy it", regardless of whether they follow the creator; "the best-performing reels are then shown to a slightly wider audience, then the best of those are shown to an even wider group, and so on." The 2024 change was designed to give all eligible content an equal chance instead of favouring accounts with large followings. — [Reelyze guide](https://getreelyze.com/guides/instagram-reels-algorithm); [Dataslayer](https://www.dataslayer.ai/blog/instagram-algorithm-2025-complete-guide-for-marketers); primary: [Instagram Creators blog](https://creators.instagram.com/blog/recommendations-and-originality)
- OFFICIAL (via secondary). September 2026: Mosseri repeated that content from small creators who post publicly is shown to accounts that do not follow them, to gauge reaction, with a view to boosting posts from new creators. One blog quotes him: the platform shows a post "to some accounts that don't follow it, just to see if it might actually be more interesting than we realize." — [Social Media Today, 24 Sep 2026](https://www.socialmediatoday.com/news/instagram-chief-shares-algorithm-insights-and-posting-tips/831326/); [cut.pro](https://cut.pro/en/blog/instagram-reels-stuck-at-200-views-2026)
- PRACTITIONER OPINION. The word "audition/auditioning" for this process is attributed to Mosseri by blogs, but no verbatim primary quote was found; treat as blogger shorthand. — [Bazzaal](https://www.bazzaal.com/blog/instagram-algorithm-2026-mosseri)
- PRACTITIONER OPINION. Seed-pool sizes such as "200 to 1,000 viewers" are unverified; other sources state Instagram has never published the size. Sources also disagree on whether the seed group is followers plus some non-followers or non-followers only. — [CreatorFlow](https://creatorflow.so/blog/why-instagram-reels-not-getting-views/); [Octupie](https://www.octupie.com/blog/inconsistent-reel-performance)

**Trial Reels**
- OFFICIAL. Meta, 10 December 2024: "Today, we're introducing trial reels, a new way to try out content and see what performs best by sharing reels with people who don't follow you." Creators can opt in to automatic sharing with followers based on the views received within the first 72 hours; the setting can be changed any time. — [Meta Newsroom](https://about.fb.com/news/2024/12/trial-reels-try-content-non-followers-first-see-what-perfoms-best/)
- OFFICIAL (via secondary). Trials are hidden from the profile grid and from followers' feeds and Reels tab; insights appear within about 24 hours; manual graduation via View insights then "Share to everyone". Collaborators cannot be added. — [Metricool](https://metricool.com/instagram-trial-reels/); [Planoly](https://www.planoly.com/blog/instagram-trial-reels.md); [Social Media Today launch coverage](https://www.socialmediatoday.com/news/instagram-launches-trial-reels-for-audience-sampling/735136/)
- OFFICIAL (via secondary, conflicting). Eligibility: 1,000+ followers is the most repeated threshold; one 2026 guide's title refers to 200 followers. Current Help Center wording on timing is "soon after you publish" rather than a fixed 72 hours. — [SuperProfile](https://superprofile.bio/guides/instagram-trial-reels.md); [Flowgent](https://flowgent.ai/blog/instagram-trial-reels); [Exemplary AI](https://exemplary.ai/blog/instagram-trial-reels)
- OFFICIAL (via secondary). Mosseri recommended trial reels again in his September 2026 series. — [Social Media Today, 24 Sep 2026](https://www.socialmediatoday.com/news/instagram-chief-shares-algorithm-insights-and-posting-tips/831326/)
- DATA STUDY (unverified, via secondary). "40% of people who tried trial reels started posting reels more often", attributed to Instagram via Social Media Today. — [Planoly](https://www.planoly.com/blog/are-instagram-trial-reels-worth-it)

### Inferences
- Because the first tier is small and rate-based, early-second retention and sends from the very first viewers decide whether a Reel is promoted to the next tier; a script's opening carries disproportionate weight.
- Trial Reels are the officially sanctioned A/B mechanism for hooks: publish two or three openings of the same script as trials and graduate the winner. Results reflect cold (non-follower) audiences, which is exactly the population the "unconnected reach" checklist targets.
- Follower count is not an official ranking input for the first test tier since April 2024; topic clarity (so the system can find "people we think will enjoy it") matters more for small accounts.

### Gaps
- Seed audience size, tier thresholds and the time window of each tier are not published.
- Exact current Trial Reels eligibility threshold (1,000 vs lower) is unresolved.
- Whether a failed trial affects the account's later distribution: no official statement found.

---

## 4. What is officially said about hashtags, captions/keywords (SEO, Google indexing), posting time, frequency, audio trends, on-screen text, subtitles, covers?

### Takeaway
Officially, hashtags do not increase reach (they only label content for search) and have been capped at five since December 2025; keywords in captions feed Instagram search, and public professional-account posts have been indexable by Google/Bing since 10 July 2025. Instagram has published no required posting time or frequency; most timing, trending-audio, subtitle and cover advice is practitioner inference.

### Cited Findings

**Hashtags**
- OFFICIAL (via secondary). Mosseri, repeatedly (February and May 2025): hashtags do not improve reach; they are "a great way to let people know what a post is about and connect posts", helping search and discoverability only. — [Social Media Today](https://www.socialmediatoday.com/news/instagrams-implementing-new-limits-on-hashtag-use/808309/); [Medium recap](https://medium.com/developersglobal/are-instagram-hashtags-dead-what-adam-mosseri-actually-said-and-what-to-do-in-2025-5aaedb3b9593)
- OFFICIAL (via secondary). 18-19 December 2025: "Instagram will gradually update the number of hashtags that you can include in a caption for a reel or post to five." Mosseri framed it as quality over quantity, said a few specific tags perform better, and repeated that hashtags help search but do not increase reach. Some test users were limited to three. — [Social Media Today](https://www.socialmediatoday.com/news/instagrams-implementing-new-limits-on-hashtag-use/808309/); [Business Today, 19 Dec 2025](https://www.businesstoday.in/technology/news/story/no-more-hashtag-stuffing-instagram-limits-hashtag-usage-to-just-5-per-reel-and-post-507444-2025-12-19)
- OFFICIAL (via secondary). Instagram search guidance: put keywords and hashtags in the caption, not in comments; users can no longer follow hashtags. — [iimagined hashtag guide](https://iimagined.ai/blog/instagram-hashtag-strategy-2026-guide)

**Keywords / SEO / Google indexing**
- OFFICIAL (via secondary). From 10 July 2025, public photos, videos and Reels from professional (Business/Creator) accounts of users over 18 can appear in Google and Bing results; enabled by default with an opt-out in Settings > Privacy; content dating back to 1 January 2020 is covered; Meta cannot guarantee removal from third-party engines. — [Metricool](https://metricool.com/instagram-indexing-on-google/); [The Week, 12 Jul 2025](https://www.theweek.in/news/sci-tech/2025/07/12/social-media-instagram-posts-and-reels-will-now-pop-up-on-google-and-bing-searches-how-to-enable-disable-this-setting.html); [Storyboard18](https://www.storyboard18.com/digital/instagram-to-make-public-posts-searchable-on-googlebing-74611.htm)
- PRACTITIONER OPINION. Sources conflict on whether Stories/highlights and profile pages are indexed. — [Influencity](https://influencity.com/blog/en/instagram-news-posts-indexed-on-google); [Logical Position](https://www.logicalposition.com/blog/instagrams-new-search-indexing-update-boost-visibility-across-google-and-bing)
- PRACTITIONER OPINION. Blogs claim Instagram's content understanding uses keywords in captions and on-screen text, and cite a Hootsuite test showing about 30% more reach for keyword-optimised captions; neither was verified against a primary source. — [Phable](https://www.phable.io/phable-labs/instagram-hashtags-keywords-discovery)

**Posting frequency and time**
- OFFICIAL (via secondary, weakly sourced). Mosseri (March 2025): "there's no perfect number" for posting frequency; post as much as you can manage well; a second Reel should not hurt one that is already taking off. He also acknowledged that posting many Stories can reduce reach per Story. — [InstantDM](https://instantdm.com/blog/how-often-to-post-on-instagram); [SocialRails](https://socialrails.com/blog/instagram-posting-frequency-guide)
- OFFICIAL (via secondary, 2026). Recency is one of Mosseri's four ranking principles (September 2026): newer posts get more exposure. — [Parasocial Magazine](https://www.parasocialmagazine.com/news/mosseri-names-four-instagram-ranking-principles-for-creators/)
- DATA STUDY. Buffer analysis of 9.6 million posts (updated September 2026) is the source for most "best time" and "3-5 feed posts a week" advice; these are Buffer's numbers, not Instagram's. — [Buffer](https://buffer.com/resources/when-is-the-best-time-to-post-on-instagram/)
- PRACTITIONER OPINION. "Post 30-60 minutes before your audience is online" is attributed to Mosseri without a primary citation. — [Zozimus](https://zozimus.com/instagram-best-practices/)

**Audio, on-screen text, subtitles, covers**
- OFFICIAL. Help Center favours reels with Instagram-library music or original audio, and demotes muted reels and reels where text covers most of the image. — [Instagram Help Center](https://help.instagram.com/1525585517644948/?helpref=related_articles%3D)
- OFFICIAL (via secondary). "Go to the audio page" and "use the reel's audio" are named predictions, so audio that others want to reuse is a positive signal. — [Fridai](https://fridai.fansnetwork.ai/en/blog/instagram-algorithm-2026)
- PRACTITIONER OPINION. "Use trending audio within 24-72 hours of its rise" is agency advice, not Instagram's. — [TrueFuture Media](https://www.truefuturemedia.com/articles/instagram-reels-reach-2026-business-growth-guide)
- PRACTITIONER OPINION. Subtitles are recommended for sound-off viewing and topic clarity; no Mosseri statement that captions/subtitles are a ranking factor was found. — [Hootsuite](https://blog.hootsuite.com/instagram-algorithm/)
- PRACTITIONER OPINION. Hook timing guidance differs between Instagram's own materials: Creators material is cited as "3 seconds", a business Reels page as "5 seconds", and one blog claims roughly the first ten seconds decide a video's fate (unsourced). — [Moonb](https://www.moonb.io/blog/instagram-reel-length)

### Inferences
- For script QC, caption and spoken/on-screen keywords should state the topic plainly (search and topic classification), with at most five specific hashtags placed in the caption. Hashtag volume is irrelevant for reach.
- Since "Your Algorithm" exposes topic-level controls to viewers (see section 5), a Reel whose topic is unambiguous in the first seconds, in the caption and in on-screen text is more likely to be matched to an interested test audience. This is inference, not an official statement.
- Posting time is at most a second-order factor: the only official hook is "recency", and no official time-of-day guidance exists.

### Gaps
- No official statement found on **covers/thumbnails** as a Reels ranking factor.
- No official statement found confirming that on-screen text or auto-captions are read for ranking (only for search/classification by inference).
- Mosseri's posting-frequency and October 2024 "carousel second chance" remarks are reported by blogs only; primary posts not located.

---

## 5. New 2025-2026 features and metrics relevant to scripting

### Takeaway
The scripting-relevant additions are the **retention chart and skip rate** (August 2025, first 3 seconds), the **views** metric (plays plus replays), 3-minute recommendation eligibility, Trial Reels, the **Reposts** feature (August 2025), viewer-side **"Your Algorithm"** topic controls (December 2025, extended to Explore in April 2026 and all surfaces in June 2026), and the Edits app. Skip rate is the first native metric that directly measures hook failure.

### Cited Findings

**Retention chart and skip rate**
- OFFICIAL (via secondary). 22 August 2025, @creators on Threads: a retention chart was added to Reels insights along with skip rate. "While view rate shows what percentage watched past the first 3 seconds of your Reel, skip rate is the percentage of views from people who decided to skip your reel during those first 3 seconds." Skip rate replaces view rate. On retention: "you'll always see a downward slope, but the flatter the line, the more engaged your audience is." — [Social Media Today](https://www.socialmediatoday.com/news/instagram-adds-retention-insights-reels/758464/); [Social Samosa](https://www.socialsamosa.com/news-2/instagram-retention-chart-skip-rate-new-performance-metrics-reels-9730992); [Metricool](https://metricool.com/instagram-reel-analytics/)
- OFFICIAL (via secondary). Meta's API reference defines `reels_skip_rate` as the percentage of views from people who skipped during the first 3 seconds, divided by initial views; the metric needs a minimum (unpublished) number of views and applies to Reels only. — [Silma](https://silma.app/blog/how-to-read-instagram-reels-analytics); [Storrito](https://storrito.com/resources/how-instagrams-updated-marketing-api-metrics-work/)
- PRACTITIONER OPINION (single source). April 2026 Insights rebuild: three tabs (Overview, Engagement, Audience) with share rate, skip rate and views over time. — [Inro](https://www.inro.social/blog/instagram-insights-update)
- PRACTITIONER OPINION. Thresholds such as "skip rate above 70% kills distribution" or "20% is good, 35% is average" have no primary source; Instagram publishes no target. — [Madgicx](https://www.madgicx.com/blog/instagram-ai-analysis); [Virallized](https://www.virallized.com/instagram-skip-rate)

**"Your Algorithm"**
- OFFICIAL. Launched 10 December 2025 (US first) as a Reels dashboard listing topics Instagram's AI infers the user cares about; users can ask to see more or less of each, add topics, and share their interests to Stories. — [Instagram blog](https://about.instagram.com/blog/announcements/reels-algorithm-control); [TechCrunch, 10 Dec 2025](https://techcrunch.com/2025/12/10/instagrams-new-your-algorithm-tool-gives-you-more-control-over-the-reels-you-see); [Engadget](https://www.engadget.com/social-media/instagram-will-let-you-control-which-topics-its-algorithm-recommends-133002612.html)
- OFFICIAL (per the same Instagram blog URL, as summarised by search). Extended to Explore on 15 April 2026 and to Feed, Reels and Explore globally in English on 10 June 2026, as one unified system. A third-party guide still claiming it affects only the Reels feed contradicts this and appears outdated. — [Instagram blog](https://about.instagram.com/blog/announcements/reels-algorithm-control); contradicted by [Storrito](https://storrito.com/resources/how-instagrams-your-algorithm-controls-actually-work/)

**Reposts, linked reels/series, Edits**
- OFFICIAL (via secondary). 6 August 2025: Reposts launched; reposted Reels and posts appear in a profile tab and can be recommended to the reposter's friends and followers. Mosseri said the feature was requested for "many years" and fits a feed where much content is recommended. — [PetaPixel, 6 Aug 2025](https://petapixel.com/2025/08/06/instagram-adds-a-reposts-tab-to-users-profiles-similar-to-tiktok/); [Beebom](https://beebom.com/instagram-rolled-out-reels-repost-and-snap-map-like-feature/)
- OFFICIAL (via secondary, 2026). Instagram is testing a "Series" home for episodic Reels and Reels that link to a full-length "Feature" video for select creators. — [The Publish Press](https://news.thepublishpress.com/p/inside-instagram-s-long-form-rebrand)
- OFFICIAL (via secondary, needs checking). Metricool's news tracker reports Instagram would stop letting creators link Reels in a series from 28 October 2026. — [Metricool Instagram news](https://metricool.com/instagram-news/)
- OFFICIAL (via secondary). Edits (Instagram's video editing app, 2025) allows links between Reels; search results report Instagram confirmed to Business Insider that Reels tagged "Made with Edits" get no preferential ranking, while one garbled source claims a temporary boost. Unresolved; treat "Edits boost" as unconfirmed. — [PhoneArena](https://www.phonearena.com/news/instagram-new-app-tiktok-drama_id166778); [Vidotech](https://vidotech.substack.com/p/edits-new-video-editing-app)

**Longer Reels, carousels vs Reels**
- OFFICIAL. 3-minute Reels eligible for recommendation since January 2025. — [Instagram Creators blog](https://creators.instagram.com/blog/the-latest-with-instagram)
- OFFICIAL (via secondary, weakly sourced). Mosseri (Threads, October 2024) said carousels get a second chance: people who did not swipe may be shown the second slide later. — [CreatorFlow formats guide](https://creatorflow.so/blog/instagram-content-formats-guide/)
- OFFICIAL. Photos and carousels with audio can be surfaced in the Reels tab. — [Instagram Creators blog](https://creators.instagram.com/blog/the-latest-with-instagram)

### Inferences
- A script-QC checklist can map one native metric to each script section: **skip rate** to the opening line and first frame (0-3 s), the **retention chart** to each beat (find the timestamp of each drop), **average watch time** to overall pacing and length, **sends per reach** to the idea's "who would I send this to" value, **likes per reach** to follower-facing resonance.
- Reposts add a second distribution path (a viewer's repost pushes the Reel to their friends); like sends, it rewards content a viewer wants to be associated with. No official statement says reposts are a named top ranking signal.
- With topic-level user controls now across Feed, Reels and Explore, single-topic Reels are easier to route than multi-topic ones (inference).

### Gaps
- No official statement on how skip rate is weighted in ranking (only that "watch less than 3 seconds" is a predicted event).
- Status of linked reels/series after October 2026 is unclear and needs a manual check.
- I found no official 2025-2026 statement that DMs/shares are *the* top signal (only "one of the most important" and "slightly more important for unconnected").

---

## 6. Quantitative benchmarks from credible analyses (length vs reach, hook/skip rate, completion, shares, format)

### Takeaway
The best-attributed 2026 data (Socialinsider) puts the reach sweet spot at 30-60 seconds (about 5.6% reach rate) with reach falling to about 3.5% beyond two minutes; Metricool reports Reels reach down about 35% year on year. Completion-rate and "good skip rate" benchmarks circulate widely but mostly lack a primary source and conflict with each other.

### Cited Findings

**Length vs reach / engagement**
- DATA STUDY. Socialinsider (business Reels, January-June 2026; sample reported as 140,000 Reels by some summaries and about 9.8 million by another): reach rate by length is under 30 s 5.20%, 30-60 s 5.60% (highest), 60-90 s 5.30%, 90-120 s 4.30%, over 120 s 3.50%. — [Socialinsider](https://www.socialinsider.io/blog/instagram-reels-statistics/); table as relayed by [inmagic](https://inmagic.ai/instagram-reels-statistics/)
- DATA STUDY. Separate Socialinsider length study (about 6 million Reels): 45-60 s has the highest engagement rate (0.35%) and highest median views (10,374); Reels over 3 minutes drop to 0.15%. — [Socialinsider, ideal Reels length](https://www.socialinsider.io/blog/instagram-reels-length/)
- DATA STUDY (small vendor, lower confidence). CollabKit, 10,000 posts: Reels under about 90 seconds outperform longer ones on median reach. — [CollabKit](https://collabkit.me/blog/instagram-reels-vs-carousels-vs-images-data-study-2026)

**Overall reach trend**
- DATA STUDY. Metricool 2026 Social Media Study (released December 2025; 1,059,949 accounts, 39,762,999 posts, ten platforms): Instagram Reels reach down 35% year on year, posts down 31%. — [Metricool press release](https://metricool.com/press-release-2026-social-media-study/)
- DATA STUDY. Socialinsider panel: Instagram average reach rate 3.50%, down 12% year on year. — [Sotrender, Aug 2026](https://www.sotrender.com/blog/2026/08/instagram-reach-is-down-what-the-data-actually-says/)

**Reels vs carousels**
- DATA STUDY. Metricool Instagram study (about 24 million posts): Reels reach 29% more people than carousels and 212% more than single images. — [UnlockDM summary](https://www.tryunlockdm.com/blog/instagram-reels-vs-carousels-2026)
- DATA STUDY. Buffer (4 million+ posts, January 2022-October 2024, so partly pre-2025): Reels get about 36% more reach than carousels. — [Blck Alpaca summary](https://blckalpaca.at/en/knowledge-base/social-media/social-media-algorithms-distribution/reels-vs-carousel-instagram-formats)
- DATA STUDY. Socialinsider 2026: Reels lead on reach only up to about 50K followers; above that carousels lead. Engagement rate (by followers): carousels about 0.55% vs Reels 0.52% in 2025, narrowing to 0.50% vs 0.48% in Q2 2026. — [Socialinsider](https://www.socialinsider.io/blog/instagram-reels-statistics/); [Showfolk](https://www.showfolk.ai/blog/instagram-carousels-vs-reels-reach); [Socialfonts](https://socialfonts.app/blog/instagram-reels-vs-carousels-vs-stories)

**Skip rate / hook rate**
- DATA STUDY (via secondary, originating page not pinned down). Socialinsider, business Reels January-June 2026: average skip rate 65.5% for accounts with 1K-5K followers. — [Virallized](https://www.virallized.com/instagram-skip-rate)
- PRACTITIONER OPINION. Instagram publishes no target for skip rate or retention; "20% good / 35% average" figures have no primary source. — [CreatorFlow retention guide](https://creatorflow.so/blog/instagram-reels-retention-graph/)

**Completion rate**
- PRACTITIONER OPINION (analyst estimates, conflicting). One analysis: 7-15 s Reels about 74% completion, 30-60 s about 49%, over 60 s about 46%. Another: above about 50% is solid for 15-30 s, 40-50% respectable for 30-60 s; explicitly not Instagram-published. Another: 60-90 s Reels fall to 28% completion yet earn the most total saves and shares. — [Slidy Creator](https://slidycreator.com/blog/instagram-reel-length-guide/); [Grow Creator](https://growcreator.pro/blog/instagram-reels-completion-rate-benchmark); [Wavevision](https://www.wavevision.io/blog/instagram-reels-metrics-which-ones-actually-matter)
- PRACTITIONER OPINION (tiny sample). A 50-Reel creator test found the 15-second cohort won on reach with a median 78% completion. — [CreatorHouse](https://creatorhouse.app/blog/instagram-reel-length-2026-test)
- PRACTITIONER OPINION. "Reels with a high share rate get 5x more distribution" has no primary source. — [Upgrow](https://www.upgrow.com/blog/instagram-reels-statistics-2026-views-watch-time-reach-engagement)

### Inferences
- Default target length for a reach-oriented script: 30-60 seconds (roughly 75-150 spoken words), with 60-90 seconds acceptable when the content justifies it; beyond 2 minutes reach rate drops by roughly a third to a half in vendor data, and beyond 3 minutes the Reel is officially ineligible for recommendation.
- Vendor "reach rate" figures are averages for brand accounts and measured against followers; they show direction (shorter mid-length wins) rather than a pass/fail threshold for an individual creator.
- If the 65.5% average skip rate for small accounts is accurate, most viewers leave in the first three seconds, so any hook that brings skip rate materially below the account's own baseline is a meaningful gain. Use the account's own historical median as the benchmark rather than a universal number.

### Gaps
- No 2025-2026 Reels benchmark from **Emplifi**, **Later** or **Hootsuite** surfaced in this session.
- No credible, primary-sourced benchmark for completion rate, sends per reach or likes per reach by account size was found; the figures circulating are analyst estimates.
- Socialinsider sample size is reported inconsistently (140,000 vs about 9.8 million Reels); the original pages need to be opened to confirm numbers and methodology.
- Buffer's own Reels-length analysis was not found.
