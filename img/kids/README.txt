CHILD PHOTOS
============

20 AI-generated portraits, made by Sam in Figma's Agents feature and pulled out
of the design file through the Figma MCP connector, then downsized here.

WHY GENERATED AND NOT REAL
  These are fake people on purpose. No real child's likeness belongs on a
  shared tablet that sits in a room all day, often with a parent standing at
  it — that's the shoulder-surfing note in D18 and the unresolved consent
  question in C5. The constraint is the reason for the set, not a limitation
  of it. Anything added here has to be synthetic too.

SIZE
  They arrive from Figma as 1024x1024 PNGs at ~1.4MB each. That is 27MB into
  a zip that is otherwise ~430KB, to fill circles that render between 22 and
  54px. Downsize on the way in:

    sips -Z 192 --setProperty format jpeg --setProperty formatOptions 82 \
      source.png --out img/kids/kN.jpg

  All 20 come to about 280KB that way.

PAIRING
  RD_KID_PIN in dashboard.jsx pins specific images to specific children by id;
  anything unpinned falls back to a hash of the id. Pinning exists because the
  demo roster has names, and a random pairing puts a boy's photo on "Emma" —
  which an educator spots instantly, and every second spent on that is a
  second not spent on what's being tested. Change any line to re-pair.

ADDING MORE
  Name them kN.jpg continuing the sequence and bump RD_KID_COUNT to match.
  A missing file is not a broken prototype: the <img> fails, and a generated
  illustrated face renders instead.

EDUCATORS ARE SEPARATE
  Their portraits are the adult stock set in ../ (p5.jpg, p12.jpg, ...), which
  is correct for them and unaffected by any of this.
