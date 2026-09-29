EDUCATOR AND ROOM PHOTOS — REMOVED
==================================

This folder used to hold 27 adult portraits (p*.jpg) and 5 room photos
(room-*.jpg). Both sets are pulled before this prototype goes to a public URL.
Only kids/ survives, because only kids/ was ours.

NOTE FOR WHOEVER REBUILDS THIS
  bundle.mjs copies img/ wholesale, so a fresh build PUTS THEM BACK. They have
  to be deleted again after every rebuild. This bit us once already between
  0.10.0 and 0.11.0.

WHY THEY GO
  The room photos carried a visible "cc-nc-nd" watermark and attribution text
  burned into the pixels. CC BY-NC-ND forbids commercial use and forbids
  derivatives, and these had been cropped and downsized to 160x160 — so both
  terms were already broken, on an image that shipped a watermark saying so.

  The adult portraits were real photographs of real, identifiable people from
  an unrecorded source, with EXIF stripped. Whatever the licence was, nobody
  could name it. Putting strangers' faces on a public URL, captioned as named
  educators at a childcare service, is not a thing to do on an assumption.

  Both sets were fine-ish while this prototype sat behind Xplor's internal,
  access-controlled Pages URL. Publishing it changed the question and neither
  set had an answer.

WHAT HAPPENS IN THE UI
  Nothing breaks. Every photo slot already had a designed fallback, because
  the prototype was written to survive a missing file:
    - educators -> cyan circle with their initials (RdAvatar)
    - rooms     -> letter tile (PhotoImg via SquareThumb)
  Wombat Club and Bilby Club never had room photos, so the room picker is
  actually MORE consistent this way, not less.

IF YOU WANT PHOTOS BACK
  Generate them the way kids/ was done: Figma Agents, out through the Figma
  MCP connector, downsized on the way in (see kids/README.txt for the sips
  one-liner). Synthetic faces were already the right answer for the children,
  and the reasoning was never actually specific to children.

  Educator filenames are pN.jpg where N comes from `img:` in the educator data
  (signin.js) or a literal path (RD_EDUCATORS in dashboard.js). The numbering
  is sparse — 5, 9, 10, 12, 14... — so match the existing numbers rather than
  renumbering, or every face in the prototype re-pairs.

  Rooms are img/room-<slug>.jpg, slug from the room name: echidna, kangaroo,
  koala, nursery, possum.

  Note p32.jpg was already missing before any of this — RD_EDUCATORS
  (dashboard.js) gives Priya Anand 'img/p32.jpg', which never existed.
