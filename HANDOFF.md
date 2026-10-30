# Lucky 7 ordering website: handoff

Last updated 2026-10-30. This file has everything needed to continue the work in a new project or session.

## 1. The client and the goal

- **Client:** Lucky 7 Deli, Market & Fried Chicken, 1938 Princeton Ave., Lawrence, NJ 08648 (Harney's Corner at 206 & Princeton Pike). Phone 609-394-1500. Open daily 5am to 11pm. Slogan "Biggest Sandwich in NJ". They use Boar's Head meat and Land O'Lakes cheese.
- **Not the client:** boarshead.com is the Boar's Head Provisions corporate site (the deli meat brand). Do not copy its logo, text or images. The folder is named "boarshead" only for historical reasons.
- **Goal:** an ordering-first website, modeled on order.kababjees.com but better. Its main job is ordering. Cart and checkout are static (client-side only) for now.
- **What the owner wants (from feedback):** ordering UX comes first. A variant (bucket size, sub length, pizza size) is ONE card with a size picker, never separate Add buttons. The theme should be strong and appetizing. It must work properly on phones. Keep reports short and act quickly.

## 2. Folders and files

| What | Path |
| --- | --- |
| Next.js site (the app) | `E:\boarshead\boarshed` |
| This handoff | `E:\boarshead\boarshed\HANDOFF.md` |
| Menu data (all 184 items, prices, sizes, choices, store info) | `E:\boarshead\boarshed\app\lib\menu.ts` |
| Photo list (which item ids have a photo) | `E:\boarshead\boarshed\app\lib\images.ts` |
| Item photos on the site (125 jpgs, named `<item-id>.jpg`, 1200x896) | `E:\boarshead\boarshed\public\menu\` |
| Hero videos (Veo, 720p, 8s) | `E:\boarshead\boarshed\public\hero\chicken.mp4`, `cheesesteak.mp4` |
| Raw Flow downloads, receiver script, prompt lists | `E:\boarshead\_flow\` |
| All 134 batch-4 prompts (id to description) | `E:\boarshead\_flow\prompts.json` |
| The 56 ids still missing photos | `E:\boarshead\_flow\missing.json` (table in section 7) |
| Local image receiver (saves POSTed images to disk) | `E:\boarshead\_flow\receiver.js` |
| Original print menu PDF | `C:\Users\musfar.hassan\Downloads\Lucky 7_Lawrence_08.13.2026 TOM 11x22 Fourthfold.pdf` |
| Menu screenshot (first 5 chicken sections) | `C:\Users\musfar.hassan\Pictures\Screenshots\Screenshot 2026-10-30 005059.png` |
| Ordering-system plan (Claude Doc) | https://claude.ai/artifact/3hevneEHwh3b2K2DLoszTG |

Git: the repo has only the create-next-app commit, and all the work is uncommitted. Commit before anything else.

## 3. Stack and how to run

- Next.js 16.4.3 (App Router, Turbopack, `cacheComponents: true`), React 19.3, Tailwind CSS v4, TypeScript. Fonts: Oswald (display) and Inter (body) via `next/font`.
- Read `AGENTS.md`: this Next.js version has breaking changes, and its docs are in `node_modules/next/dist/docs/`.
- Run `npm run dev` in `E:\boarshead\boarshed` and open http://localhost:3000. Only one `next dev` can run per folder. If one is already running, use it rather than starting another on a different port.
- Checks: `npx tsc --noEmit` and `npx eslint app`. Both are clean as of this handoff.

## 4. What is built

**Home page (`/`) is the ordering page.** `/menu` redirects to `/`.

- `app/page.tsx`: hero slider, then a phone-only pickup/delivery strip, then `OrderMenu`.
- `components/HeroSlider.tsx`: 2 autoplaying muted video slides (fried chicken, cheesesteak) with an "Order chicken"/"Order subs" button that jumps to the section. Switches every 8s, with dots.
- `components/OrderMenu.tsx`: sticky category tabs that follow scroll, a search box, a "Popular" section, a 2-column grid on phones and 3 on desktop, and a sticky cart sidebar on desktop (`lg`). On phones, a "View cart" bar at the bottom. The + button adds simple items directly. Items with sizes or choices open the popup.
- `components/ItemModal.tsx`: bottom sheet on phones and a centered dialog on desktop. Photo, size picker (required), choice chips (sauce, cheese, bread, dressing), special instructions, quantity, and an "Add to cart $X" button.
- `components/CartPanel.tsx`: order summary (cart lines with +/−, subtotal, NJ tax 6.625%, total, Checkout) and `ModeToggle` (pickup/delivery). Used by the desktop sidebar and the phone sheet.
- `components/CartDrawer.tsx`: phone slide-in cart sheet.
- `components/cart.tsx`: cart context. Lines are keyed by itemId+size+option+note, and the cart plus the pickup/delivery mode are saved in localStorage (`lucky7-cart-v3`).
- `components/Header.tsx`: charcoal bar with the logo, hours and address (xl), pickup/delivery toggle (md+), phone, and a cart button (phones: bag icon + total + count badge).
- `components/Footer.tsx`: address, directions, hours, phone.
- `components/ItemPhoto.tsx`: `next/image` photo, or a dark tile with the red "7" logo while there is no photo.
- `app/checkout/`: summary first on phones, then the form (pickup/delivery, time, name, phone, notes, pay at pickup; card is "coming soon"). A "Place order" bar stays at the bottom on phones. A fake order number appears on submit. Nothing is sent and nothing is charged.
- Theme (`app/globals.css`): fryer red `#d62300`, mustard gold `#ffb81c`, charcoal `#1b1b1b`, warm off-white `#f7f4ef`.

**Menu data model (`app/lib/menu.ts`):** `MenuCategory { id, title, note?, choice?, items }` and `MenuItem { id, name, desc?, price? | sizes?: {label, price}[], choice?, popular? }`. There are 17 categories and 184 items, transcribed from the 08.13.2026 print menu. Item ids are the category prefix plus the slug of the name, for example `hs-cheesesteak`, `cs-lucky-7-italian`, `fried-chicken-bucket`, `bw`… A photo file must be named exactly `<item-id>.jpg`.

**Menu note:** the print menu's Reubens box says "Roast Beef Special $12.99". It is shown as "Roast Beef Reuben $12.99" and still needs confirming with the client.

## 5. Image and video generation (Google Flow)

- **Browser:** use Chrome **Browser 2** (Claude in Chrome device "Browser 2", deviceId `22f60c46-f888-450e-9977-05aa9a2526c7`), signed in as **syedmusfar88@gmail.com** with the Google AI Pro plan. Do NOT use Browser 3 (centricon.tech@gmail.com). The owner said Browser 2. Browser 3 was used by mistake for the first 24 images.
- **Flow projects (Browser 2):** "Oct 30 - 16:40" (`flow.google.com/project/ed551dfe-4278-4704-9900-5a55fa3173fe`, batch 3 plus the 2 hero videos) and "Oct 30 - 17:03" (`flow.google.com/project/28ac256b-963e-497b-8ef1-8ab39c620e50`, batch 4, with 78 done and 56 failed).
- **Image settings:** Image mode, **Nano Banana Pro**, **4:3**, **x1**. Images showed "0 credits".
- **Video settings:** Video mode, **Veo 3.1 – Fast**, 16:9, 720p, 8s, x1, about 20 credits each. Download at 720p.
- **Style prefix (use for every image so the set matches):**
  > Professional food photography for the Lucky 7 deli in New Jersey, three-quarter overhead angle, food centered and filling most of the frame, on a dark charcoal slate surface with red-and-white checkered deli paper, warm golden key light, shallow depth of field, appetizing, realistic, no text, no logos, no hands, no people. Item: <description>
- **Gotchas:**
  - Never type "/" (for example "3/4"): it focuses Flow's search box. Use "three-quarter".
  - Fast submission: in the page, `document.querySelector('[role=textbox][contenteditable=true]').focus(); document.execCommand('insertText', false, text)`, then press a real Enter key. Clicking the submit button by script does not work.
  - When many are queued, Enter is sometimes ignored. Wait until the box is empty before inserting the next prompt, and press Enter again if text is still there.
  - **Usage limit:** about 78 Nano Banana Pro images in one burst triggered "You've reached your usage limit. Please try again later." Failed generations are not charged. Retry later in smaller batches.
  - Chrome blocks multiple automatic downloads. To save images, run `node E:\boarshead\_flow\receiver.js E:\boarshead\_flow\in`, which listens on 127.0.0.1:3199. In the Flow `/edit/<id>` view, fetch the image (`img[alt="Read-only image view"]`) and `POST` it to `http://127.0.0.1:3199/save?name=<item-id>.jpg`. Read the prompt's "Item: …" text from the page to know which item it is, and step through images with the "Next media" and "Previous media" buttons.
  - For a video download, hook `HTMLAnchorElement.prototype.click` to grab the blob URL, then click Download, pick 720p and POST the blob the same way.
- **After saving photos:** copy them into `public/menu/`, regenerate `app/lib/images.ts` from that folder listing, and run the id check: every file name must be a real item id.

## 6. Status

| Area | Status |
| --- | --- |
| Full menu (17 categories, 184 items, sizes and choices) | Done |
| Ordering UX (cards, size popup, cart, checkout, pickup/delivery) | Done (static, no backend) |
| Mobile responsive (checked at 375px, no sideways scroll) | Done |
| Hero video slider (2 Veo videos) | Done |
| Item photos | 125 of 184 done. 59 missing: the 56 below plus `hs-turkey-reuben`, `hs-corned-beef-reuben`, `hs-roast-beef-reuben`, which will reuse the `rb-` photos once those exist |
| Ordering-system plan | Written (Claude Doc linked above) |
| Real backend, payments, POS, delivery | Not started (see the plan) |
| Git commit | Not done |

**Known issue:** the C: drive is almost full (about 100 MB free). It crashed the image receiver once. Keep all scratch files on E:, and free space on C:.

## 7. The 56 photos still missing (item id and description; add the style prefix)

| Item id | Description |
| --- | --- |
| hs-italian-sausage-parmigiana | Italian sausage parmigiana sub with marinara and melted mozzarella on a long Italian roll |
| hs-meatballs-parmigiana | meatball parmigiana sub with marinara and melted mozzarella on a long Italian roll |
| hs-hot-roast-beef-and-gravy | hot roast beef sub smothered in brown gravy on a long Italian roll |
| rb-turkey-reuben | turkey reuben sandwich on grilled rye bread with Swiss cheese, sauerkraut and Russian dressing, cut diagonally |
| rb-corned-beef-reuben | corned beef reuben sandwich on grilled rye bread with Swiss cheese, sauerkraut and Russian dressing, cut diagonally |
| rb-roast-beef-reuben | roast beef reuben sandwich on grilled rye bread with Swiss cheese, sauerkraut and Russian dressing, cut diagonally |
| sp-pastrami-special | pastrami special sandwich on rye bread with Swiss cheese, coleslaw and Russian dressing, cut diagonally |
| sp-turkey-special | turkey special sandwich on rye bread with Swiss cheese, coleslaw and Russian dressing, cut diagonally |
| sp-corned-beef-special | corned beef special sandwich on rye bread with Swiss cheese, coleslaw and Russian dressing, cut diagonally |
| sp-roast-beef-special | roast beef special sandwich on rye bread with Swiss cheese, coleslaw and Russian dressing, cut diagonally |
| wr-turkey-and-cheese | turkey and cheese wrap in a flour tortilla with lettuce and tomato, cut in half diagonally |
| wr-italian | Italian wrap with ham, salami, provolone, lettuce and tomato in a flour tortilla, cut in half diagonally |
| wr-ham-and-cheese | ham and cheese wrap with lettuce and tomato in a flour tortilla, cut in half diagonally |
| wr-turkey-and-bacon | turkey and crispy bacon wrap with lettuce and tomato in a flour tortilla, cut in half diagonally |
| wr-tuna-salad | tuna salad wrap with lettuce in a flour tortilla, cut in half diagonally |
| wr-chicken-salad | chicken salad wrap with lettuce in a flour tortilla, cut in half diagonally |
| wr-grilled-chicken | grilled chicken wrap with lettuce and tomato in a flour tortilla, cut in half diagonally |
| wr-cheesesteak | cheesesteak wrap with chopped steak, melted cheese and onions in a flour tortilla, cut in half diagonally |
| wr-chicken-cheesesteak | chicken cheesesteak wrap with chopped chicken and melted cheese in a flour tortilla, cut in half diagonally |
| wr-cheeseburger | cheeseburger wrap with chopped beef, melted cheese, lettuce and tomato in a flour tortilla, cut in half diagonally |
| wr-chicken-fingers | crispy chicken fingers wrap with lettuce and ranch in a flour tortilla, cut in half diagonally |
| sa-antipasto-salad | antipasto salad in a clear takeout bowl with ham, salami, provolone, lettuce, tomatoes, peppers and olives |
| sa-tuna-on-salad | salad in a clear takeout bowl topped with a scoop of tuna, lettuce, tomatoes, cucumbers, boiled egg |
| sa-crispy-chicken-on-salad | salad in a clear takeout bowl topped with sliced crispy fried chicken, lettuce, tomatoes, cucumbers, croutons |
| sa-tuna-salad-on-salad | salad in a clear takeout bowl topped with a scoop of creamy tuna salad, lettuce, tomatoes and egg |
| sa-shrimp-on-salad | salad in a clear takeout bowl topped with grilled shrimp, lettuce, tomatoes, cucumbers |
| sa-ham-and-cheese-salad | salad in a clear takeout bowl topped with rolled ham and American cheese strips, lettuce, tomatoes, egg |
| sa-chicken-salad-on-salad | salad in a clear takeout bowl topped with a scoop of chicken salad, lettuce, tomatoes and cucumbers |
| sa-seafood-on-salad | salad in a clear takeout bowl topped with seafood salad with crab and shrimp, lettuce and tomatoes |
| sa-turkey-and-cheese-salad | salad in a clear takeout bowl topped with rolled turkey and cheese strips, lettuce, tomatoes, egg |
| sa-2-pcs-fish-on-salad | salad in a clear takeout bowl topped with two golden fried fish fillets, lettuce and tomatoes |
| sa-honey-turkey-and-cheese-salad | salad in a clear takeout bowl topped with honey turkey and cheese, lettuce, tomatoes and cucumbers |
| sa-mixed-cheeses-on-salad | salad in a clear takeout bowl topped with strips of American, provolone and Swiss cheese, lettuce and tomatoes |
| sa-add-bacon | a small paper cup of crispy chopped bacon bits |
| sd-mozzarella-fries | french fries covered in melted stretchy mozzarella cheese in a red paper boat |
| sd-bacon-cheese-fries | french fries with melted cheese sauce and crispy bacon bits in a red paper boat |
| sd-pizza-fries | pizza fries, french fries topped with marinara sauce and melted mozzarella in a red paper boat |
| sd-curly-fries | seasoned golden curly fries in a red paper boat |
| sd-potato-wedges | seasoned golden potato wedges in a red paper boat |
| sd-potato-salad | creamy deli potato salad in a clear deli container with a spoon |
| sd-macaroni-salad | creamy deli macaroni salad in a clear deli container with a spoon |
| sd-coleslaw | creamy deli coleslaw in a clear deli container |
| sd-egg-salad | deli egg salad in a clear deli container with a spoon |
| sd-seafood-salad | deli seafood salad with crab and shrimp in a clear deli container |
| sd-chicken-salad | deli chicken salad in a clear deli container with a spoon |
| sd-tuna-salad | deli tuna salad in a clear deli container with a spoon |
| sd-broccoli-bites | golden fried broccoli and cheese bites in a red paper boat |
| sd-corn-nuggets | golden fried sweet corn nuggets in a red paper boat |
| sd-jalape-o-peppers | breaded fried jalapeno poppers with cream cheese in a red paper boat |
| sd-fried-mushrooms | breaded fried mushrooms with ranch dip in a red paper boat |
| pz-1-topping-pizza | whole New Jersey pepperoni pizza with crispy cupped pepperoni, one slice pulled |
| pz-2-pizzas-w-2-toppings | two whole pizzas side by side, one pepperoni and mushroom, one sausage and onion |
| pz-veggie-pizza | whole veggie pizza with tomatoes, onions, black olives and green peppers, one slice pulled |
| pz-meat-lovers-pizza | whole meat lovers pizza with meatballs, ham, pepperoni, sausage and bacon, one slice pulled |
| pz-grilled-chicken-pizza | whole grilled chicken pizza with extra melted cheese, one slice pulled |
| pz-steak-pizza | whole cheesesteak pizza topped with chopped steak, onions and melted cheese, one slice pulled |

After the three `rb-*-reuben` photos exist, copy them to `hs-turkey-reuben.jpg`, `hs-corned-beef-reuben.jpg` and `hs-roast-beef-reuben.jpg`.

## 8. Next steps

1. Commit the current work to git, then back it up or push to a remote.
2. Generate the 56 missing photos in Browser 2 when the Flow limit resets, in batches of about 20.
3. Confirm with the client the "Roast Beef Special $12.99" typo, the real logo, store photos and whether delivery is offered.
4. Compress the photos (they are about 0.8 MB each, 96 MB total): convert to WebP at about 1200px. `next/image` already serves resized versions.
5. Build the real ordering system from the plan (https://claude.ai/artifact/3hevneEHwh3b2K2DLoszTG). In short: build the site and admin yourselves; use Square or Stripe for card payments, Square or Toast for POS and kitchen screens, and DoorDash Drive or Uber Direct for delivery drivers. Use PostgreSQL with a real-time order board, Twilio for texts, and per-location menus, hours, tax and routing. The phases are:
   1. Pickup ordering with online payment (weeks 1 to 4).
   2. POS and kitchen screens (weeks 5 to 6).
   3. Delivery (weeks 7 to 8).
   4. Multiple locations, accounts and loyalty (week 9 onward).
6. Deploy (for example Vercel) once there is a backend. Set the store's NJ tax and hours as configuration, not constants.
