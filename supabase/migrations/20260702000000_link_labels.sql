-- Relationship labels on world-links: an optional short phrase describing HOW
-- two linked entities relate ("guards", "serves", "trapped here"). Additive and
-- nullable, so every existing link is unaffected. App code trims and caps input
-- at 80 chars; the CHECK is defense in depth against other write paths.
alter table storygen.links
  add column if not exists label text
  constraint links_label_len check (label is null or char_length(label) <= 80);
