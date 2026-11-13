#!/usr/bin/env python3
"""Mesures automatiques d'un script de vidéo courte pour le skill Viralité.

Usage : python3 -I script_stats.py <fichier> [--platform reels|tiktok|shorts] [--json]

Convention de lignes (facultative) :
  VISUEL: / PLAN: / IMAGE:          -> piste visuelle
  TEXTE: / ÉCRAN: / ECRAN: / TXT:   -> texte affiché à l'écran
  VO: / VOIX: / DIT: / PAROLE:      -> voix off ou parole
  LÉGENDE: / LEGENDE: / CAPTION:    -> légende de publication
Sans aucune balise, tout le texte est considéré comme parlé.
Les préfixes de minutage du type "[0-3s]" ou "00:03" en début de ligne sont ignorés.

Ces mesures sont des indices pour le relecteur, pas un verdict.
"""
import argparse
import json
import re
import sys
import unicodedata

TAGS = {
    "visuel": ["visuel", "plan", "image", "visual", "b-roll", "broll"],
    "texte": ["texte", "écran", "ecran", "txt", "on-screen", "onscreen", "text", "carton"],
    "vo": ["vo", "voix", "voix off", "dit", "parole", "voiceover", "voice"],
    "legende": ["légende", "legende", "caption", "description"],
    "meta": ["titre", "title", "sujet", "cible", "durée", "duree", "format", "plateforme", "note", "notes", "objectif"],
}
TAG_RE = re.compile(r"^\s*[-*]?\s*\**\s*([A-Za-zÀ-ÿ \-]{1,12}?)\s*\**\s*[:：]\s*(.*)$")
TIME_PREFIX_RE = re.compile(r"^\s*(\[[^\]]{0,20}\]|\(?\d{1,2}[:h]\d{2}\)?|\(?\d{1,3}(?:[.,]\d)?\s*-\s*\d{1,3}(?:[.,]\d)?\s*s\)?)\s*[-–—:]?\s*")

GREETINGS = [r"\bsalut\b", r"\bbonjour\b", r"\bhello\b", r"\bcoucou\b", r"\bhey\b",
             r"aujourd'hui,? (je|on) va", r"dans cette vid[ée]o", r"bienvenue",
             r"je vais vous parler", r"je vais te parler", r"avant de commencer"]
BAIT = [r"\blike[sz]? si\b", r"\blikez\b", r"\bcommente[sz]? (?:\"|«\s*)?(?:oui|non)\b",
        r"\btague[sz]?\b.*\b(?:amis?|personnes?|potes?)\b", r"\btaguez\b",
        r"\bidentifie[sz]?\b.*\b(?:amis?|personnes?|potes?)\b",
        r"\bpartage[sz]? (?:à|a) \d+", r"\bpartage[sz]? si\b", r"\bdouble[- ]tap\b",
        r"\bmet(?:s|tez) un like\b", r"\bl[âa]che[sz]? un like\b", r"\btag (?:\d|un|trois)\b",
        r"\bdis(?:-moi|-nous)? oui en commentaire\b", r"\bmet(?:s|tez) un \S+ en commentaire\b"]
ENDINGS = [r"merci d'avoir regard", r"merci pour votre attention", r"[àa] bient[ôo]t",
           r"[àa] la prochaine", r"ciao", r"bye", r"abonne[- ]toi", r"abonnez[- ]vous",
           r"n'oublie(z)? pas de (t'abonner|vous abonner|liker)"]
ABSOLUTES = [r"\btoujours\b", r"\bgaranti(?:e|s|es)?\b", r"100 ?%", r"\bjamais\b",
             r"\btout le monde\b", r"\bpersonne ne\b", r"\bincroyables?\b", r"\bmagiques?\b",
             r"\bsecrets?\b", r"\br[ée]volution\w*", r"\bparfait\w*", r"\bmeilleur\w*"]
SEQUENCE = [r"\b(?:et )?puis\b", r"\bensuite\b", r"\bapr[èe]s [çc]a\b"]
CONNECTORS = [r"\bmais\b", r"\bdonc\b", r"\bsauf que\b", r"\bdu coup\b", r"\bpourtant\b",
              r"\bc'est pour [çc]a\b", r"\balors que\b"]
YOU = re.compile(r"\b(tu|toi|ton|ta|tes|t'|vous|votre|vos)\b|\bt'", re.IGNORECASE)

WPS_PLAN = 2.0        # mots par seconde pour planifier
WPS_MAX = 170 / 60.0  # débit énergique maximal


def norm_tag(raw):
    t = unicodedata.normalize("NFC", raw.strip().lower())
    for key, names in TAGS.items():
        if t in names:
            return key
    return None


def parse(text):
    tracks = {"visuel": [], "texte": [], "vo": [], "legende": [], "meta": []}
    tagged = False
    current = None
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        line = TIME_PREFIX_RE.sub("", line)
        m = TAG_RE.match(line)
        tag = norm_tag(m.group(1)) if m else None
        if tag:
            tagged = True
            current = tag
            content = m.group(2).strip()
            if content:
                tracks[tag].append(content)
        elif current and tagged:
            tracks[current].append(line)
        else:
            tracks["vo"].append(line)
    if not tagged:
        tracks = {"visuel": [], "texte": [], "vo": [l for l in tracks["vo"] if not l.startswith("#")],
                  "legende": [], "meta": []}
    return tracks, tagged


def words(s):
    return re.findall(r"[\wÀ-ÿ'’%-]+", s)


def sentences(lines):
    joined = " ".join(lines)
    parts = re.split(r"(?<=[.!?…])\s+", joined)
    return [p.strip() for p in parts if p.strip()]


def find(patterns, text):
    hits = []
    for p in patterns:
        for m in re.finditer(p, text, re.IGNORECASE):
            hits.append(m.group(0))
    return hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--platform", default="reels", choices=["reels", "tiktok", "shorts"])
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    with open(args.file, encoding="utf-8") as f:
        text = f.read()
    tracks, tagged = parse(text)

    vo_text = " ".join(tracks["vo"])
    vo_words = words(vo_text)
    n = len(vo_words)
    sents = sentences(tracks["vo"])
    long_sents = [s for s in sents if len(words(s)) > 15]
    first_sentence = sents[0] if sents else ""
    first_vo_words = len(words(first_sentence))
    hook_text = tracks["texte"][0] if tracks["texte"] else ""
    caption = " ".join(tracks["legende"])
    all_text = text
    last_sentence = sents[-1] if sents else ""

    hashtags = re.findall(r"#[\wÀ-ÿ]+", caption if caption else all_text)
    opening_zone = " ".join(words(vo_text)[:25])

    stats = {
        "plateforme": args.platform,
        "balises_detectees": tagged,
        "pistes": {k: len(v) for k, v in tracks.items()},
        "mots_parles": n,
        "duree_estimee_s": {
            "planification_2_mots_par_s": round(n / WPS_PLAN, 1),
            "debit_max_170_mots_par_min": round(n / WPS_MAX, 1),
        },
        "premiere_phrase_dite": first_sentence,
        "premiere_phrase_mots": first_vo_words,
        "premiere_phrase_duree_s": round(first_vo_words / WPS_MAX, 1),
        "premiere_phrase_tu_vous": bool(YOU.search(first_sentence)),
        "texte_hook": hook_text,
        "texte_hook_mots": len(words(hook_text)),
        "texte_hook_identique_a_la_voix": bool(hook_text) and
            hook_text.strip(" .!?").lower() == first_sentence.strip(" .!?").lower(),
        "nb_phrases": len(sents),
        "phrases_plus_de_15_mots": long_sents,
        "ouverture_salutation_ou_contexte": find(GREETINGS, opening_zone),
        "appats_engagement": find(BAIT, all_text),
        "fin_au_revoir_ou_abonnement": find(ENDINGS, last_sentence + " " + " ".join(sents[-2:])),
        "derniere_phrase": last_sentence,
        "enchainements_sequentiels_et_puis": find(SEQUENCE, vo_text),
        "enchainements_mais_donc": len(find(CONNECTORS, vo_text)),
        "absolus_superlatifs": find(ABSOLUTES, vo_text + " " + " ".join(tracks["texte"])),
        "hashtags": hashtags,
        "nb_hashtags": len(hashtags),
    }

    alerts = []
    d = stats["duree_estimee_s"]["planification_2_mots_par_s"]
    if args.platform == "reels" and d > 90:
        alerts.append(f"Durée estimée {d} s : au-delà de 90 s le reach baisse nettement sur Reels (A13).")
    if d > 180:
        alerts.append(f"Durée estimée {d} s > 3 min : plus recommandable aux non-abonnés (B1).")
    if args.platform == "reels" and d < 15 and n > 0:
        alerts.append(f"Durée estimée {d} s : très court, vérifier que la promesse est tenue (A13).")
    if first_vo_words > 9:
        alerts.append(f"Première phrase de {first_vo_words} mots (~{stats['premiere_phrase_duree_s']} s) : hook dit trop long (B7, cible ≤ 3 s).")
    if stats["ouverture_salutation_ou_contexte"]:
        alerts.append("Ouverture par salutation ou contexte : " + ", ".join(set(stats["ouverture_salutation_ou_contexte"])) + " (B7).")
    if stats["appats_engagement"]:
        alerts.append("Appât à engagement probable : " + ", ".join(set(stats["appats_engagement"])) + " (B4).")
    if stats["fin_au_revoir_ou_abonnement"]:
        alerts.append("Fin en au revoir / abonnement : " + ", ".join(set(stats["fin_au_revoir_ou_abonnement"])) + " (A12).")
    if len(hashtags) > 5:
        alerts.append(f"{len(hashtags)} hashtags : 5 maximum (B2).")
    if tagged and not tracks["texte"]:
        alerts.append("Aucun texte à l'écran prévu : hook à une ou deux couches (B6, A8).")
    if tagged and not tracks["visuel"]:
        alerts.append("Aucune indication visuelle : hook à une ou deux couches (B6, A14).")
    if not tagged:
        alerts.append("Script sans pistes séparées (VISUEL / TEXTE / VO) : impossible de vérifier le hook en trois couches (B6).")
    if hook_text and not (5 <= stats["texte_hook_mots"] <= 8):
        alerts.append(f"Texte du hook de {stats['texte_hook_mots']} mots : règle maison 5-8 (A9).")
    if stats["texte_hook_identique_a_la_voix"]:
        alerts.append("Le texte du hook répète mot pour mot la phrase dite : il doit la compléter (B6).")
    if long_sents:
        alerts.append(f"{len(long_sents)} phrase(s) parlée(s) de plus de 15 mots (A15).")
    if stats["enchainements_sequentiels_et_puis"]:
        alerts.append(f"{len(stats['enchainements_sequentiels_et_puis'])} enchaînement(s) séquentiel(s) (« et puis », « ensuite ») : test mais/donc (A10).")
    if stats["absolus_superlatifs"]:
        alerts.append("Absolus ou superlatifs à justifier : " + ", ".join(sorted(set(a.lower() for a in stats["absolus_superlatifs"]))) + " (A15, B3).")
    if first_sentence and not stats["premiere_phrase_tu_vous"]:
        alerts.append("Pas de « tu / vous » dans la première phrase (A15) — acceptable si le hook est visuel ou résultat d'abord.")
    stats["alertes"] = alerts

    if args.json:
        print(json.dumps(stats, ensure_ascii=False, indent=2))
        return

    print(f"Plateforme : {args.platform} | pistes balisées : {'oui' if tagged else 'non'} "
          f"| lignes visuel/texte/voix/légende : {stats['pistes']['visuel']}/{stats['pistes']['texte']}/"
          f"{stats['pistes']['vo']}/{stats['pistes']['legende']}")
    print(f"Mots parlés : {n} | durée estimée : {stats['duree_estimee_s']['planification_2_mots_par_s']} s "
          f"(2 mots/s) à {stats['duree_estimee_s']['debit_max_170_mots_par_min']} s (170 mots/min)")
    print(f"Première phrase dite ({first_vo_words} mots) : {first_sentence}")
    if hook_text:
        print(f"Texte du hook ({stats['texte_hook_mots']} mots) : {hook_text}")
    print(f"Dernière phrase : {last_sentence}")
    print(f"Phrases : {len(sents)} | > 15 mots : {len(long_sents)} | « mais/donc » : "
          f"{stats['enchainements_mais_donc']} | « et puis/ensuite » : {len(stats['enchainements_sequentiels_et_puis'])}"
          f" | hashtags : {len(hashtags)}")
    print("\nAlertes :" if alerts else "\nAucune alerte automatique.")
    for a in alerts:
        print(f"- {a}")
    for s in long_sents:
        print(f"  · phrase longue ({len(words(s))} mots) : {s}")


if __name__ == "__main__":
    sys.exit(main())
