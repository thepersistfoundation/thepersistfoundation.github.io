# The Persist Foundation — Website

Live site: https://thepersistfoundation.org/

Static one-page site for The Persist Foundation (*Until I Succeed!*).

## Structure
- `index.html` — home page (hero, about, programs, values, get involved, donate, contact)
- `scholarship.html` — scholarship application form; `scholarship-thanks.html` — confirmation page
- `styles.css` — styles, using the colors from the TPF seal
- `script.js` — mobile menu, scroll animations, donation picker, contact form
- `assets/` — seal logo, favicon, social preview image

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` and go to http://localhost:8000.

## Hosting
Served by GitHub Pages from the `main` branch of thepersistfoundation/thepersistfoundation.github.io at the custom
domain https://thepersistfoundation.org/ (set by the `CNAME` file; DNS is managed at Wix). The old
https://thepersistfoundation.github.io/ address redirects there. Every push to `main` updates the live site within a minute or two.
If the domain ever changes, update `CNAME`, the `og:image` / `og:url` tags and the `_next` field in `scholarship.html`.

## Contact & donations
- Contact email: `thepersistfoundation@gmail.com` (the contact form opens the visitor's email app addressed to it).
- Donations go to PayPal's donate page for the PayPal account registered to `thepersistfoundation@gmail.com`
  (see the hidden `business` field on the donate form in `index.html`). Donors can choose a one-time or monthly gift.
- To use a PayPal hosted button instead, replace the `business` hidden input with `<input type="hidden" name="hosted_button_id" value="...">`.

## Photo gallery
Photos live in `assets/gallery/` and are listed in the `#gallery` section of `index.html` (one `<figure>` each, with alt text and a caption).
Resize photos to about 1600px wide and strip location data before adding them. Add `g-wide` to a figure to make it span two columns.

## Scholarship applications
The form on `scholarship.html` is delivered by [FormSubmit](https://formsubmit.co) to `thepersistfoundation@gmail.com`
as a formatted email (replying to it replies to the applicant).
- The **first** submission sends an activation email to that inbox — click **Activate Form** in it, or applications won't be delivered.
- The form shows only between the dates in `data-open` / `data-close` on the `#apply` section of `scholarship.html`
  (currently March 1 – April 30, 2027, Indiana time). Outside those dates visitors see an "opens on…" or "closed" message.
- To see or test the form at any time, add `?preview` to the address: `https://thepersistfoundation.org/scholarship.html?preview`
- For a new cycle, update those two dates plus the award, dates and pill text near the top of `scholarship.html`.

## Before launch
- Confirm a PayPal **Business** account is registered to `thepersistfoundation@gmail.com`, then make a small test donation.
