# The Persist Foundation — Website

Live site: https://thepersistfoundation.github.io/

Static one-page site for The Persist Foundation (*Until I Succeed!*).

## Structure
- `index.html` — page markup (hero, about, programs, values, get involved, donate, contact)
- `styles.css` — styles, using the colors from the TPF seal
- `script.js` — mobile menu, scroll animations, donation picker, contact form
- `assets/` — seal logo, favicon, social preview image

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` and go to http://localhost:8000.

## Hosting
Served by GitHub Pages from the `main` branch of thepersistfoundation/thepersistfoundation.github.io at
https://thepersistfoundation.github.io/ — every push to `main` updates the live site within a minute or two.
If you move to a custom domain, update the `og:image` and `og:url` tags in `index.html`.

## Contact & donations
- Contact email: `thepersistfoundation@gmail.com` (the contact form opens the visitor's email app addressed to it).
- Donations go to PayPal's donate page for the PayPal account registered to `thepersistfoundation@gmail.com`
  (see the hidden `business` field on the donate form in `index.html`). Donors can choose a one-time or monthly gift.
- To use a PayPal hosted button instead, replace the `business` hidden input with `<input type="hidden" name="hosted_button_id" value="...">`.

## Before launch
- Confirm a PayPal **Business** account is registered to `thepersistfoundation@gmail.com`, then make a small test donation.
