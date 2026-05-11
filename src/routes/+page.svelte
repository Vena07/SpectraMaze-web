<script>
    import { enhance } from '$app/forms';
    import { Zap, PartyPopper, Camera, Disc3, GlassWater, ArrowRight, ArrowLeft, Send, MapPin, CalendarDays, Users, Utensils, Video, ShieldCheck, Gift, Phone, Info } from 'lucide-svelte';

    export let form;

    let currentStep = 1;
    const totalSteps = 3;

    // PROMĚNNÁ PRO NAČÍTÁNÍ
    let isSubmitting = false;

    let formData = {
        venue: 'bilej-medved',
        altVenues: [], 
        date: '',
        altPreferences: '', 
        classCount: '1', 
        package: 'public',
        barKat1: 0, barKat2: 0, barKat3: 0, otherBar: 'none', 
        services: { dj: false, photo: false, catering: false, video: false, extraSec: false, tombola: false },
        school: '', contactName: '', email: '', phone: ''
    };

    // Textové kapacity bez čísel
    const venues = [
        { id: 'bilej-medved', name: 'Bílej Medvěd', capacityDesc: 'VELKÝ PROSTOR', image: '/medved_thumb.jpg' },
        { id: 'fenix-club', name: 'Fénix Club', capacityDesc: 'STŘEDNÍ PROSTOR', image: '/fenix_thumb.jpg' },
        { id: 'watt-music-club', name: 'WATT Music Club', capacityDesc: 'STŘEDNÍ PROSTOR', image: '/watt_thumb.jpg' }
    ];

    const packages = [
        { id: 'public', name: 'FULL PALBA MEJDAN', price: 0, desc: 'Nájem 0 Kč (platí se ze vstupů). Otevřená párty, vč. DJe a marketingu.' },
        { id: 'private', name: 'PRIVATE PARTY', price: 6500, desc: 'Uzavřená společnost jen pro vás. Zahrnuje prostor, techniku, pásky, security a úklid.' },
        { id: 'deluxe', name: 'DELUXE PRIVATE', price: 13000, desc: 'Zahrnuje všechny doplňkové služby v ceně (DJ, foto, catering, atd.).' }
    ];

    let showDjWarning = false;
    let showOtherBars = false;
    let showDateError = false; 

    $: {
        if (formData.altVenues.includes(formData.venue)) {
            formData.altVenues = formData.altVenues.filter(v => v !== formData.venue);
        }
    }

    function nextStep() { 
        if (currentStep < totalSteps) {
            currentStep++; 
            window.scrollTo(0, 0);
        }
    }
    function prevStep() { 
        if (currentStep > 1) {
            currentStep--;
            window.scrollTo(0, 0);
        }
    }

    function handleNextStep() {
        if (currentStep === 1) {
            if (!formData.date) {
                showDateError = true;
                return;
            }
            showDateError = false;

            if (formData.package === 'private' && !formData.services.dj) {
                showDjWarning = true;
                return;
            }
        }
        nextStep();
    }

    function addDjAndContinue() { formData.services.dj = true; showDjWarning = false; nextStep(); }
    function continueWithoutDj() { showDjWarning = false; nextStep(); }

    $: selectedVenueObj = venues.find(v => v.id === formData.venue);
    $: selectedPackage = packages.find(p => p.id === formData.package);
    $: isDeluxe = formData.package === 'deluxe';
    $: isPublic = formData.package === 'public';
    
    $: basePrice = selectedPackage ? selectedPackage.price : 0;
    $: djPrice = formData.package === 'private' && formData.services.dj ? 3500 : 0;
    $: photoPrice = isDeluxe ? 0 : (formData.services.photo ? 1500 : 0);
    $: cateringPrice = isDeluxe ? 0 : (formData.services.catering ? 1500 : 0);
    $: videoPrice = isDeluxe ? 0 : (formData.services.video ? 1500 : 0);
    $: extraSecPrice = isDeluxe ? 0 : (formData.services.extraSec ? 1500 : 0);
    $: tombolaPrice = isDeluxe ? 0 : (formData.services.tombola ? 1500 : 0);
    $: barPrice = (formData.barKat1 * 700) + (formData.barKat2 * 900) + (formData.barKat3 * 1200);
    $: depositPrice = isPublic ? 0 : 3000;

    $: estimatedTotal = basePrice + djPrice + photoPrice + cateringPrice + videoPrice + extraSecPrice + tombolaPrice + barPrice + depositPrice;
</script>

<svelte:head>
    <title>Maturitní Mazce | Medved clubs</title>
    <script>
        if (typeof fbq !== 'undefined') fbq('track', 'ViewContent');
    </script>
    
    {#if form?.success === true}
        <script>
            if (typeof fbq !== 'undefined') fbq('track', 'Purchase');
        </script>
    {/if}
</svelte:head>

<section class="prom-hero">
    <div class="hero-bg"><img src="/images/nav-maturity.jpg" alt="Maturitní afterparty v Medved clubs" loading="lazy" /></div>
    <div class="hero-overlay"></div>
    <div class="container hero-content">
        <div class="badge">Oficiální afterparty</div>
        <h1>Maturák končí,<br><strong>mazec začíná.</strong></h1>
        <p>Nezapomeňte zadat datum maturáku! Vyberte si ten nejlepší prostor pro svou afterparty, naklikejte si služby a zbytek nechte na nás.</p>
        <div class="features-grid">
            <div class="feat"><Zap size={20}/> Top zvuk a světla</div>
            <div class="feat"><GlassWater size={20}/> Bezedné bary</div>
            <div class="feat"><Disc3 size={20}/> DJs na míru</div>
        </div>
    </div>
</section>

<section class="configurator-section container" id="kalkulacka">
    {#if form?.success === true}
        
        

        <div class="success-message">
            <PartyPopper size={48} class="success-icon" />
            <h2>Poptávka úspěšně odeslána!</h2>
            <p>{form?.message || 'Brzy se vám ozveme.'}</p>
            <div class="contact-card mt-4">
                <p>Potřebujete řešit něco urgentně?</p>
                <strong>Booking: Jiří Kaas</strong><br>
                <a href="tel:+420733119501">+420 733 119 501</a>
            </div>
            <a href="/" class="btn btn-primary mt-4">Zpět na web</a>
        </div>
    {:else}
        <div class="config-header-main"><h2>Rezervace Afterparty</h2></div>
        <div class="layout-grid">
            <div class="form-column">
                <div class="progress-container"><div class="progress-bar" style="width: {(currentStep / totalSteps) * 100}%"></div></div>
                <div class="step-indicator mb-4">Krok {currentStep} z {totalSteps}</div>

                <form class="config-form" method="POST" use:enhance={() => {
                    isSubmitting = true;
                    return async ({ update }) => {
                        await update();
                        isSubmitting = false;
                    };
                }}>
                    {#if form?.error}
                        <div class="error-banner">{form.error}</div>
                    {/if}

                    {#if currentStep === 1}
                        <div class="step-content">
                            <h3><MapPin size={22}/> Prostor, balíček a termíny</h3>
                            
                            <div class="input-box mb-3">
                                <label for="date" style="font-size: 1rem;">1. volba: Datum maturáku (Urgentní)</label>
                                <input type="date" id="date" bind:value={formData.date} required />
                                {#if showDateError}
                                    <span style="color: #ef4444; font-weight: 600; font-size: 0.85rem; margin-top: 0.3rem;">⚠️ Prosím zadejte datum maturitního plesu.</span>
                                {/if}
                            </div>

                            <div class="input-box mb-4">
                                <label for="altPreferences" style="font-size: 0.95rem; color: var(--text-muted);">Alternativní termíny / Další preference (nepovinné)</label>
                                <input type="text" id="altPreferences" bind:value={formData.altPreferences} placeholder="Např. bereme i 15.3. nebo potřebujeme větší šatnu..." />
                            </div>

                            <label class="block-label mt-4">1. volba: Kde to odpálíme?</label>
                            <div class="venues-grid mb-2">
                                {#each venues as venue}
                                    <label class="venue-card {formData.venue === venue.id ? 'selected' : ''}">
                                        <div class="venue-bg" style="background-image: url('{venue.image}')"></div>
                                        
                                        <input type="radio" bind:group={formData.venue} value={venue.id} />
                                        <div class="vc-top">
                                            <span style="font-size: 1.1rem; font-weight: 700;">{venue.name}</span>
                                        </div>
                                        <div class="vc-bottom">
                                            <span class="capacity">{venue.capacityDesc}</span>
                                        </div>
                                    </label>
                                {/each}
                            </div>

                            <label class="block-label mt-3" style="font-size: 0.9rem; color: var(--text-muted);">Alternativní prostory (když bude 1. volba obsazená):</label>
                            <div class="grid-options mb-4">
                                {#each venues.filter(v => v.id !== formData.venue) as venue}
                                    <label class="option-card {formData.altVenues.includes(venue.id) ? 'selected' : ''}" style="padding: 0.8rem 1.2rem;">
                                        <input type="checkbox" bind:group={formData.altVenues} value={venue.id} />
                                        <span style="font-size: 0.95rem; font-weight: 600;">{venue.name}</span>
                                    </label>
                                {/each}
                            </div>

                            <label class="block-label mt-5">Jaký styl párty preferujete?</label>
                            <div class="packages-grid">
                                {#each packages as pkg}
                                    <label class="package-card {formData.package === pkg.id ? 'selected' : ''}">
                                        <input type="radio" bind:group={formData.package} value={pkg.id} />
                                        {#if pkg.id === 'deluxe'}
                                            <div class="pkg-header">
                                                <h4>{pkg.name}</h4>
                                                <div style="text-align: right;">
                                                    <span class="price-strikethrough">17 900 CZK</span>
                                                    <span class="price">{pkg.price.toLocaleString()} Kč</span>
                                                </div>
                                            </div>
                                            <p>{pkg.desc}</p>
                                        {:else}
                                            <div class="pkg-header">
                                                <h4>{pkg.name}</h4>
                                                <span class="price">{pkg.price === 0 ? '0 Kč' : `${pkg.price.toLocaleString()} Kč`}</span>
                                            </div>
                                            <p>{pkg.desc}</p>
                                        {/if}
                                    </label>
                                {/each}
                            </div>

                            <h3 class="mt-5"><PartyPopper size={22}/> Doplňkové služby</h3>
                            <div class="services-list">
                                {#if !isPublic}
                                    <label class="service-row {formData.services.dj || isDeluxe ? 'active' : ''}">
                                        <div class="serv-info">
                                            <Disc3 size={24} />
                                            <div><strong>Rezidentní ověřený DJ</strong><span>Zahraje přesně podle vašeho Spotify playlistu.</span></div>
                                        </div>
                                        <div class="serv-action">
                                            <div style="text-align: right;">
                                                {#if !isDeluxe}<span class="price-strikethrough">3 900 CZK</span>{/if}
                                                <span class="price">{isDeluxe ? 'V ceně' : '+3 500 Kč'}</span>
                                            </div>
                                            <input type="checkbox" bind:checked={formData.services.dj} disabled={isDeluxe} />
                                        </div>
                                    </label>
                                {/if}

                                <label class="service-row {formData.services.photo || isDeluxe ? 'active' : ''}">
                                    <div class="serv-info">
                                        <Camera size={24} />
                                        <div><strong>Profesionální fotoreport</strong><span>Profi fotky z celé afterparty.</span></div>
                                    </div>
                                    <div class="serv-action">
                                        <span class="price">{isDeluxe ? 'V ceně' : '+1 500 Kč'}</span>
                                        <input type="checkbox" bind:checked={formData.services.photo} disabled={isDeluxe} />
                                    </div>
                                </label>

                                <label class="service-row {formData.services.catering || isDeluxe ? 'active' : ''}">
                                    <div class="serv-info">
                                        <Utensils size={24} />
                                        <div><strong>Catering do backstage</strong><span>Drobné občerstvení pro organizátory.</span></div>
                                    </div>
                                    <div class="serv-action">
                                        <span class="price">{isDeluxe ? 'V ceně' : '1 500 Kč'}</span>
                                        <input type="checkbox" bind:checked={formData.services.catering} disabled={isDeluxe} />
                                    </div>
                                </label>

                                <label class="service-row {formData.services.video || isDeluxe ? 'active' : ''}">
                                    <div class="serv-info">
                                        <Video size={24} />
                                        <div><strong>Natáčení maturitního intra</strong><span>Třídě poskytneme naše prostory pro natáčení.</span></div>
                                    </div>
                                    <div class="serv-action">
                                        <span class="price">{isDeluxe ? 'V ceně' : '+1 500 Kč'}</span>
                                        <input type="checkbox" bind:checked={formData.services.video} disabled={isDeluxe} />
                                    </div>
                                </label>

                                <label class="service-row {formData.services.extraSec || isDeluxe ? 'active' : ''}">
                                    <div class="serv-info"><ShieldCheck size={24} /><div><strong>Extra Security</strong></div></div>
                                    <div class="serv-action"><span class="price">{isDeluxe ? 'V ceně' : '+1 500 Kč'}</span><input type="checkbox" bind:checked={formData.services.extraSec} disabled={isDeluxe} /></div>
                                </label>

                                <label class="service-row {formData.services.tombola || isDeluxe ? 'active' : ''}">
                                    <div class="serv-info"><Gift size={24} /><div><strong>Balík dárků do tomboly</strong></div></div>
                                    <div class="serv-action"><span class="price">{isDeluxe ? 'V ceně' : '+1 500 Kč'}</span><input type="checkbox" bind:checked={formData.services.tombola} disabled={isDeluxe} /></div>
                                </label>
                            </div>
                        </div>
                    {/if}

                    {#if currentStep === 2}
                        <div class="step-content">
                            <h3><GlassWater size={22}/> Pijete a bavíte se</h3>
                            
                            <label class="block-label">Jak to máte letos zařízené?</label>
                            <div class="grid-options mb-5">
                                <label class="option-card {formData.classCount === '1' ? 'selected' : ''}">
                                    <input type="radio" bind:group={formData.classCount} value="1" />
                                    <span style="font-size: 1.1rem; font-weight: 700;">Jsme 1 třída</span>
                                </label>
                                <label class="option-card {formData.classCount === '2' ? 'selected' : ''}">
                                    <input type="radio" bind:group={formData.classCount} value="2" />
                                    <span style="font-size: 1.1rem; font-weight: 700;">Jsme 2 třídy</span>
                                </label>
                            </div>

                            <label class="block-label">Vyberte si bezedné bary (Lze kombinovat pro různé počty osob):</label>
                            
                            <div class="bar-slider-box">
                                <div class="bs-top">
                                    <div><strong>Bezedný bar Kat 1</strong><br><small>Vodka, Morgan, Zelená + Nealko</small></div>
                                    <span class="bs-price">{formData.barKat1} x 700 Kč</span>
                                </div>
                                <input type="range" min="0" max="150" step="1" bind:value={formData.barKat1} />
                            </div>

                            <div class="bar-slider-box mt-3">
                                <div class="bs-top">
                                    <div><strong>Bezedný bar Kat 2</strong><br><small>Kat 1 + Jägermeister, Gin, Víno, Energy</small></div>
                                    <span class="bs-price">{formData.barKat2} x 900 Kč</span>
                                </div>
                                <input type="range" min="0" max="150" step="1" bind:value={formData.barKat2} />
                            </div>

                            <div class="bar-slider-box mt-3 mb-4">
                                <div class="bs-top">
                                    <div><strong>Bezedný bar Kat 3</strong><br><small>Kat 2 + Jack Daniels, Red Bull, Cuba Libre, Pivo</small></div>
                                    <span class="bs-price">{formData.barKat3} x 1200 Kč</span>
                                </div>
                                <input type="range" min="0" max="150" step="1" bind:value={formData.barKat3} />
                            </div>

                            <div class="other-bars-toggle">
                                <button type="button" class="btn-text-subtle" on:click={() => showOtherBars = !showOtherBars}>Zobrazit další možnosti barů (pokud nechcete bezedný)</button>
                            </div>

                            {#if showOtherBars}
                                <div class="grid-options mt-3">
                                    <label class="option-card {formData.otherBar === 'none' ? 'selected' : ''}">
                                        <input type="radio" bind:group={formData.otherBar} value="none" />
                                        <span>Zpět na bezedné bary</span>
                                    </label>
                                    <label class="option-card {formData.otherBar === 'standard' ? 'selected' : ''}">
                                        <input type="radio" bind:group={formData.otherBar} value="standard" />
                                        <span>Standardní bar</span><span class="price-hint">Každý si platí útratu sám.</span>
                                    </label>
                                    <label class="option-card {formData.otherBar === 'budget' ? 'selected' : ''}">
                                        <input type="radio" bind:group={formData.otherBar} value="budget" />
                                        <span>Předplacený budget</span><span class="price-hint">Maturanti mají předplacený bar.</span>
                                    </label>
                                </div>
                            {/if}
                        </div>
                    {/if}

                    {#if currentStep === 3}
                        <div class="step-content">
                            <h3><CalendarDays size={22}/> Kontaktní údaje</h3>
                            
                            <div class="contact-inputs mt-4">
                                <div class="input-box"><label>Název školy a třída</label><input type="text" name="school" bind:value={formData.school} placeholder="Např. SPŠD 4.A" required /></div>
                                <div class="input-box"><label>Jméno zástupce</label><input type="text" name="contactName" bind:value={formData.contactName} required /></div>
                                <div class="input-box"><label>E-mail</label><input type="email" name="email" bind:value={formData.email} required /></div>
                                <div class="input-box"><label>Telefon</label><input type="tel" name="phone" bind:value={formData.phone} required /></div>
                            </div>

                            <div class="info-notice mt-5">
                                <Info size={24} class="notice-icon" />
                                <div><p>V případě zájmu se můžeme sejít v jakémkoliv prostoru, ukázat si možnosti a domluvit vše osobně.</p></div>
                            </div>
                            <div class="info-notice mt-3">
                                <CalendarDays size={24} class="notice-icon" />
                                <div>
                                    <p>V případě, že bude termín volný, přijde vám potvrzení na e-mail.</p>
                                    <ul class="notice-list">
                                        <li>Kauce a pronájem se platí při podpisu smlouvy.</li>
                                        <li>Služby a bezedné bary se řeší 1-2 měsíce před maturákem.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    {/if}

                    <input type="hidden" name="venue" value={formData.venue} />
                    <input type="hidden" name="altVenues" value={formData.altVenues.join(', ')} />
                    <input type="hidden" name="altPreferences" value={formData.altPreferences} />
                    <input type="hidden" name="date" value={formData.date} />
                    <input type="hidden" name="classCount" value={formData.classCount} />
                    <input type="hidden" name="package" value={formData.package} />
                    <input type="hidden" name="school" value={formData.school} />
                    <input type="hidden" name="contactName" value={formData.contactName} />
                    <input type="hidden" name="email" value={formData.email} />
                    <input type="hidden" name="phone" value={formData.phone} />
                    <input type="hidden" name="totalPrice" value={estimatedTotal} />
                    <input type="hidden" name="barKat1" value={formData.barKat1} />
                    <input type="hidden" name="barKat2" value={formData.barKat2} />
                    <input type="hidden" name="barKat3" value={formData.barKat3} />
                    <input type="hidden" name="otherBar" value={formData.otherBar} />
                    
                    {#if formData.services.dj || isDeluxe || isPublic}<input type="hidden" name="dj" value="on" />{/if}
                    {#if formData.services.photo || isDeluxe}<input type="hidden" name="photo" value="on" />{/if}
                    {#if formData.services.catering || isDeluxe}<input type="hidden" name="catering" value="on" />{/if}
                    {#if formData.services.video || isDeluxe}<input type="hidden" name="video" value="on" />{/if}
                    {#if formData.services.extraSec || isDeluxe}<input type="hidden" name="extraSec" value="on" />{/if}
                    {#if formData.services.tombola || isDeluxe}<input type="hidden" name="tombola" value="on" />{/if}

                    <div class="form-actions" style={currentStep === 3 ? "flex-direction: column; gap: 1rem;" : ""}>
                        {#if showDateError}
                            <div style="text-align: right; width: 100%; color: #ef4444; font-weight: 700; margin-bottom: -0.5rem; font-size: 0.9rem;">Nejprve vyplňte datum maturáku.</div>
                        {/if}
                        <div style="display: flex; justify-content: space-between; width: 100%;">
                            {#if currentStep > 1}
                                <button type="button" class="btn btn-secondary" on:click={prevStep} disabled={isSubmitting}><ArrowLeft size={18} /> Zpět</button>
                            {:else}
                                <div></div>
                            {/if}
                            
                            {#if currentStep < totalSteps}
                                <button type="button" class="btn btn-primary" on:click={handleNextStep}>Pokračovat <ArrowRight size={18} /></button>
                            {:else}
                                <button type="submit" class="btn btn-submit" disabled={isSubmitting}>
                                    {#if isSubmitting}
                                        Odesílám... <span class="spinner"></span>
                                    {:else}
                                        Závazně poptat termín <Send size={18} />
                                    {/if}
                                </button>
                            {/if}
                        </div>
                        {#if currentStep === 3}
                            <div class="quick-consult">
                                <a href="tel:+420733119501" class="btn btn-outline-yellow" style="pointer-events: {isSubmitting ? 'none' : 'auto'}; opacity: {isSubmitting ? '0.5' : '1'};"><Phone size={18}/> Blesková konzultace: +420 733 119 501</a>
                            </div>
                        {/if}
                    </div>
                </form>
            </div>

            <div class="receipt-column">
                <div class="receipt-box">
                    <h4>SHRNUTÍ</h4>
                    <p class="rc-step">KROK {currentStep} Z {totalSteps}</p>

                    <div class="rc-items">
                        {#if selectedPackage}
                            <div class="rc-item">
                                <span class="r-price" style={isPublic ? "color: #06b6d4;" : ""}>{basePrice > 0 ? `+${basePrice.toLocaleString()} Kč` : '0 Kč'}</span>
                                <strong>{selectedPackage.name}</strong>
                                <small>1. Volba: {selectedVenueObj?.name || 'Nevybráno'}</small>
                            </div>
                        {/if}

                        {#if formData.barKat1 > 0}<div class="rc-item"><span class="r-price">+{(formData.barKat1 * 700).toLocaleString()} Kč</span><strong>BEZEDNÝ BAR KAT 1</strong><small>PRO {formData.barKat1} OSOB</small></div>{/if}
                        {#if formData.barKat2 > 0}<div class="rc-item"><span class="r-price">+{(formData.barKat2 * 900).toLocaleString()} Kč</span><strong>BEZEDNÝ BAR KAT 2</strong><small>PRO {formData.barKat2} OSOB</small></div>{/if}
                        {#if formData.barKat3 > 0}<div class="rc-item"><span class="r-price">+{(formData.barKat3 * 1200).toLocaleString()} Kč</span><strong>BEZEDNÝ BAR KAT 3</strong><small>PRO {formData.barKat3} OSOB</small></div>{/if}
                        {#if formData.otherBar !== 'none'}<div class="rc-item"><strong>{formData.otherBar === 'standard' ? 'STANDARDNÍ BAR' : 'PŘEDPLACENÝ BUDGET'}</strong></div>{/if}

                        {#if depositPrice > 0}
                            <div class="rc-item">
                                <span class="r-price">+{depositPrice.toLocaleString()} Kč</span>
                                <strong>VRATNÁ ZÁLOHA</strong>
                                <small>NA VYBAVENÍ A ŠKODY</small>
                            </div>
                        {/if}

                        {#if formData.package === 'private' && formData.services.dj}<div class="rc-item tiny"><span>DJ</span><span>+3 500 Kč</span></div>{/if}
                        
                        {#if !isDeluxe && formData.services.photo}<div class="rc-item tiny"><span>Fotoreport</span><span>+1 500 Kč</span></div>{/if}
                        {#if !isDeluxe && formData.services.catering}<div class="rc-item tiny"><span>Catering</span><span>+1 500 Kč</span></div>{/if}
                        {#if !isDeluxe && formData.services.video}<div class="rc-item tiny"><span>Video Intro</span><span>+1 500 Kč</span></div>{/if}
                        {#if !isDeluxe && formData.services.extraSec}<div class="rc-item tiny"><span>Extra Security</span><span>+1 500 Kč</span></div>{/if}
                        {#if !isDeluxe && formData.services.tombola}<div class="rc-item tiny"><span>Dárky Tombola</span><span>+1 500 Kč</span></div>{/if}
                    </div>

                    <div class="rc-total">
                        <span>ORIENTAČNÍ KALKULACE</span>
                        <strong>{estimatedTotal.toLocaleString('cs-CZ')} Kč</strong>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</section>

{#if showDjWarning}
    <div class="modal-overlay">
        <div class="modal">
            <div class="modal-header"><h2>Upozornění: Chybí vám DJ</h2></div>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 2rem;">Velmi doporučujeme mít vlastního DJe a nespoléhat se jen na playlist z telefonu. Je to jistota perfektní atmosféry. Našim DJům lze zaslat vaše playlisty na Spotify.</p>
            <div class="modal-actions mt-4">
                <button class="btn btn-secondary" on:click={continueWithoutDj}>Nechci DJe, pokračovat</button>
                <button class="btn btn-primary" on:click={addDjAndContinue}>Přidat DJe (+3 500 Kč)</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .prom-hero { position: relative; padding: 6rem 0 4rem; background-color: #0a0a0a; color: #fff; margin-top: -80px; border-bottom: 1px solid #333; overflow: hidden; }
    .hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; background-color: #111; }
    .hero-bg img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
    .hero-overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,1) 100%); z-index: 2; }
    .hero-content { position: relative; z-index: 3; max-width: 800px; text-align: center; padding-top: 4rem; margin: 0 auto; }
    .badge { display: inline-block; background-color: #fff; color: #000; padding: 0.4rem 1rem; border-radius: 100px; font-weight: 800; text-transform: uppercase; font-size: 0.8rem; margin-bottom: 1.5rem; letter-spacing: 0.05em; }
    .prom-hero h1 { font-size: 3.5rem; line-height: 1.1; margin-bottom: 1.5rem; }
    .prom-hero h1 strong { color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.3); }
    .prom-hero p { font-size: 1.2rem; color: #aaa; margin-bottom: 3rem; }
    .features-grid { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; }
    .feat { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-size: 1rem; }

    .configurator-section { padding: 4rem 1.5rem 6rem; position: relative; z-index: 10; margin-top: -4rem; }
    .config-header-main { text-align: center; margin-bottom: 2rem; }
    .config-header-main h2 { font-size: 2.2rem; }

    .layout-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: start; }
    @media (min-width: 1024px) { .layout-grid { grid-template-columns: 1fr 380px; } }

    .form-column { background-color: var(--bg-color); border: 1px solid var(--border-color); padding: 2.5rem; border-radius: 8px; }
    .progress-container { width: 100%; height: 4px; background: var(--border-color); margin-bottom: 0.5rem; }
    .progress-bar { height: 100%; background: var(--text-main); transition: width 0.3s; }
    .step-indicator { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; text-align: center; }

    .step-content h3 { display: flex; align-items: center; gap: 0.8rem; font-size: 1.4rem; margin-bottom: 1.5rem; }
    .subtitle { color: var(--text-muted); margin-top: -1rem; margin-bottom: 2rem; }
    .block-label { display: block; font-weight: 600; margin-bottom: 1rem; }
    
    .input-box { display: flex; flex-direction: column; gap: 0.5rem; }
    .input-box label { font-size: 0.95rem; font-weight: 600; }
    .input-box input { padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 4px; background-color: transparent; color: var(--text-main); font-family: var(--font-main); }
    .input-box input:focus { outline: none; border-color: var(--text-main); }
    .mb-2 { margin-bottom: 0.5rem; } .mb-3 { margin-bottom: 1rem; } .mb-4 { margin-bottom: 1.5rem; } .mb-5 { margin-bottom: 2.5rem; } .mt-3 { margin-top: 1rem; } .mt-4 { margin-top: 1.5rem; } .mt-5 { margin-top: 2.5rem; }

    .grid-options { display: grid; grid-template-columns: 1fr; gap: 1rem; }
    @media (min-width: 500px) { .grid-options { grid-template-columns: 1fr 1fr; } }
    .option-card { border: 2px solid var(--border-color); border-radius: 8px; padding: 1.2rem; cursor: pointer; display: flex; flex-direction: column; gap: 0.3rem; transition: all 0.2s; }
    .option-card input { display: none; }
    .option-card.selected { border-color: var(--text-main); background-color: var(--text-main); color: var(--bg-color); }
    .option-card.selected span { color: var(--bg-color) !important; }
    .price-hint { font-size: 0.85rem !important; opacity: 0.8; font-weight: 400 !important; }

    .venues-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
    @media (min-width: 600px) { .venues-grid { grid-template-columns: 1fr 1fr; } }
    
    .venue-card { position: relative; overflow: hidden; border: 1px solid var(--border-color); border-radius: 8px; padding: 1.2rem; cursor: pointer; transition: all 0.2s; background: var(--bg-color); }
    .venue-card input { display: none; }
    
    .venue-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; opacity: 0.15; transition: transform 0.4s ease, opacity 0.3s ease; z-index: 0; }
    
    .venue-card:hover .venue-bg { opacity: 0.3; transform: scale(1.05); }
    .venue-card.selected { border-color: var(--text-main); background: rgba(255,255,255,0.03); }
    .venue-card.selected .venue-bg { opacity: 0.4; }
    
    .vc-top, .vc-bottom { position: relative; z-index: 1; }
    .vc-top { margin-bottom: 0.5rem; text-shadow: 0 1px 4px rgba(0,0,0,0.8); }
    .vc-bottom .capacity { font-size: 0.85rem; color: #ef4444; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.8); display: block; }

    .packages-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 2rem; }
    .package-card { border: 2px solid var(--border-color); border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: all 0.2s; }
    .package-card input { display: none; }
    .package-card.selected { border-color: var(--text-main); background-color: var(--text-main); color: var(--bg-color); }
    .pkg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .pkg-header h4 { font-size: 1.1rem; margin: 0; }
    .pkg-header .price { font-weight: 700; font-size: 1.1rem; }
    .price-strikethrough { text-decoration: line-through; color: var(--text-muted); font-size: 0.85rem; display:block; }
    .package-card.selected .price-strikethrough { color: rgba(0,0,0,0.6); }
    .package-card p { font-size: 0.9rem; opacity: 0.8; margin: 0; }

    .bar-slider-box { border: 1px solid var(--border-color); border-radius: 6px; padding: 1.5rem; }
    .bs-top { display: flex; justify-content: space-between; margin-bottom: 1rem; align-items: center;}
    .bs-price { font-weight: 700; color: var(--text-main); }
    .bar-slider-box input[type="range"] { width: 100%; accent-color: var(--text-main); cursor: pointer; }
    
    .other-bars-toggle { text-align: center; margin-top: 1rem; }
    .btn-text-subtle { background: none; border: none; color: var(--text-muted); font-size: 0.85rem; text-decoration: underline; cursor: pointer; transition: color 0.2s; }
    .btn-text-subtle:hover { color: var(--text-main); }

    .services-list { display: flex; flex-direction: column; gap: 1rem; }
    .service-row { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem; border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .service-row.active { border-color: var(--text-main); background-color: rgba(0,0,0,0.03); }
    .serv-info { display: flex; align-items: center; gap: 1rem; }
    .serv-info strong { display: block; font-size: 1.1rem; }
    .serv-info span { font-size: 0.85rem; color: var(--text-muted); }
    .serv-action { display: flex; align-items: center; gap: 1rem; }
    .serv-action .price { font-weight: 700; font-size: 1.1rem; }
    .serv-action input { width: 20px; height: 20px; accent-color: var(--text-main); cursor: pointer; }

    .contact-inputs { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
    @media (min-width: 600px) { .contact-inputs { grid-template-columns: 1fr 1fr; } }

    .info-notice { display: flex; gap: 1rem; background-color: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 8px; }
    .notice-icon { color: var(--text-muted); flex-shrink: 0; margin-top: 0.2rem; }
    .info-notice p { margin: 0; font-size: 0.95rem; line-height: 1.5; font-weight: 500; }
    .notice-list { margin-top: 0.5rem; padding-left: 1.2rem; font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; }

    .form-actions { display: flex; justify-content: space-between; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.8rem 1.5rem; border-radius: 4px; font-weight: 600; border: none; cursor: pointer; transition: 0.2s; }
    .btn-primary { background-color: var(--text-main); color: var(--bg-color); }
    .btn-secondary { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); }
    
    /* STYLY PRO ODESÍLACÍ TLAČÍTKO A NAČÍTÁNÍ */
    .btn-submit { background-color: #ef4444; color: white; padding: 1rem 2rem; position: relative; }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
    .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .btn-outline-yellow { border: 2px solid #eab308; color: #eab308; background: transparent; text-decoration: none; width: 100%; margin-top: 1rem; }

    .receipt-column { position: sticky; top: 100px; }
    .receipt-box { border: 2px solid var(--border-color); border-radius: 12px; padding: 2rem; background: #050505; }
    .receipt-box h4 { text-align: center; font-size: 1.5rem; margin-bottom: 0.2rem; }
    .rc-step { text-align: center; font-size: 0.8rem; color: var(--text-muted); font-weight: 700; margin-bottom: 2rem; }
    
    .rc-items { display: flex; flex-direction: column; gap: 1rem; }
    .rc-item { background: #111; padding: 1rem; border-radius: 6px; text-align: center; border: 1px solid #222; }
    .rc-item .r-price { display: block; color: #ef4444; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.3rem; }
    .rc-item strong { display: block; font-size: 1.1rem; letter-spacing: 0.05em; margin-bottom: 0.2rem; }
    .rc-item small { display: block; font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; }
    
    .rc-item.tiny { display: flex; justify-content: space-between; background: transparent; padding: 0.5rem 0; border: none; border-bottom: 1px dashed #333; border-radius: 0; text-align: left; }
    .rc-item.tiny span { font-size: 0.9rem; font-weight: 600; }
    .rc-item.tiny span:last-child { color: var(--text-muted); }

    .rc-total { margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid #333; text-align: center; }
    .rc-total span { display: block; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem; }
    .rc-total strong { font-size: 1.8rem; }

    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(4px); }
    .modal { background: var(--bg-color); border: 1px solid var(--border-color); padding: 2.5rem; border-radius: 8px; width: 100%; max-width: 500px; text-align: center; }
    .modal-header { margin-bottom: 1rem; }
    .modal h2 { font-size: 1.5rem; }
    .modal-actions { display: flex; flex-direction: column; gap: 1rem; }
    @media (min-width: 500px) { .modal-actions { flex-direction: row; justify-content: center; } }
    
    .error-banner { background-color: #fef2f2; color: #b91c1c; padding: 1rem; border: 1px solid #f87171; border-radius: 6px; margin-bottom: 1.5rem; font-weight: 600; text-align: center; }
    .success-message { text-align: center; padding: 4rem 2rem; background-color: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; }
    .success-icon { color: #22c55e; margin-bottom: 1.5rem; }
    .success-message h2 { font-size: 2.5rem; margin-bottom: 1rem; }
    .contact-card { background: #111; padding: 1.5rem; border-radius: 8px; border: 1px solid #333; max-width: 300px; margin: 0 auto; }
</style>