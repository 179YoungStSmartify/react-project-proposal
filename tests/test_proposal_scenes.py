"""Regression tests for proposal tier-card header visuals.

Run: python3 -m unittest discover -s tests -p 'test_*.py' -v
"""
import os
import re
import unittest
from html.parser import HTMLParser

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_PATH = os.path.join(REPO, "client", "proposal-tiers.html")


def extract_div_block(html, start_index):
    depth = 0
    i = start_index
    open_re = re.compile(r"<div\b")
    close_re = re.compile(r"</div\s*>")
    while i < len(html):
        opening = open_re.search(html, i)
        closing = close_re.search(html, i)
        if closing is None:
            raise AssertionError("unbalanced div block")
        if opening is not None and opening.start() < closing.start():
            depth += 1
            i = opening.end()
        else:
            depth -= 1
            i = closing.end()
            if depth == 0:
                return html[start_index:closing.end()]
    raise AssertionError("unbalanced div block")


def tier_block(html, tier):
    match = re.search(r'<div\b[^>]*data-tier="%s"[^>]*>' % re.escape(tier), html)
    if match is None:
        raise ValueError("tier not found: " + tier)
    return extract_div_block(html, match.start())


class TagBalance(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
            "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if not self.stack or self.stack[-1] != tag:
            self.errors.append("mismatched closing tag: " + tag)
        else:
            self.stack.pop()


class ProposalTierVisualsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(HTML_PATH, encoding="utf-8") as source:
            cls.html = source.read()

    def band(self, tier):
        block = tier_block(self.html, tier)
        match = re.search(r'<div[^>]*class="tier-band[^>]*>[\s\S]*?</div>', block)
        self.assertIsNotNone(match, tier + " band not found")
        return match.group(0)

    def test_document_tags_balanced(self):
        parser = TagBalance()
        parser.feed(self.html)
        self.assertEqual([], parser.errors)
        self.assertEqual([], parser.stack)

    def test_tier_headers_are_image_free(self):
        for tier in ("silver", "gold", "platinum"):
            band = self.band(tier)
            self.assertNotIn("<img", band)
            self.assertNotIn("<svg", band)
            self.assertNotIn("<figure", band)

    def test_each_tier_uses_a_distinct_metallic_gradient(self):
        for colour in ("silver", "gold", "platinum"):
            self.assertRegex(self.html, r"\.band-%s\s*\{[^}]*linear-gradient" % colour)

    def test_recommended_badge_sits_inside_gold_band(self):
        gold = tier_block(self.html, "gold")
        self.assertIn('<span class="recommended-badge">Recommended</span>', gold)
        self.assertNotIn('<div class="ribbon">', gold)
        rule_match = re.search(r"\.recommended-badge\s*\{([^}]*)\}", self.html)
        self.assertIsNotNone(rule_match)
        compact = rule_match.group(1).replace(" ", "")
        self.assertIn("position:absolute", compact)
        self.assertIn("top:", compact)
        self.assertIn("right:20px", compact)
        self.assertNotIn("rotate(", compact)
        self.assertNotIn("right:-", compact)

    def test_recommended_tier_cards_stay_level_with_other_cards(self):
        self.assertRegex(
            self.html,
            r"\.tier\.featured\s*\{[^}]*transform:\s*translateY\(-6px\)[^}]*\}",
        )
        self.assertRegex(
            self.html,
            r"\.page\s*>\s*\.tiers\s*>\s*\.tier\.featured,\s*\.network-proposal\s*>\s*\.tiers\s*>\s*\.tier\.featured\s*\{[^}]*transform:\s*none",
        )
        self.assertRegex(
            self.html,
            r"\.recommended-badge\s*\{[^}]*position:\s*absolute",
        )

    def test_high_level_tiers_do_not_show_processing_as_a_feature_row(self):
        for tier in ("silver", "gold", "platinum"):
            card = tier_block(self.html, tier)
            self.assertNotIn('<span class="k">Processing</span>', card, tier)
        self.assertNotRegex(self.html, r'<td>Processing</td>')

    def test_tier_band_heights_remain_responsive(self):
        self.assertRegex(self.html, r"\.tier-band\s*\{[^}]*height:\s*150px")
        self.assertRegex(self.html, r"\.tier-band\s*\{[^}]*height:\s*128px")

    def test_remote_access_copy_is_concise_and_mentions_paid_subscription(self):
        expected = "Remote access is available through a paid Nabu Casa Home Assistant Cloud subscription."
        self.assertEqual(2, self.html.count(expected))
        self.assertNotIn("Remote access away from home is planned", self.html)

    def test_tier_cards_use_compact_wall_display_codes(self):
        expected = {
            "silver": "2×S, 1×M, 1×L",
            "gold": "2×S, 2×L",
            "platinum": "2×S, 1×L High Performance, 1×XL High Performance",
        }
        for tier, description in expected.items():
            card = tier_block(self.html, tier)
            row = re.search(r'<li><span class="k">Wall screens</span><span class="v">([^<]+)</span></li>', card)
            self.assertIsNotNone(row, tier)
            self.assertEqual(description, " ".join(row.group(1).split()), tier)
            self.assertNotRegex(row.group(1), r"Shelly|Samsung|Android|X1i|X2i")

    def test_network_cards_use_tier_gradients_without_inline_overrides(self):
        network_section = re.search(r'<!-- ================= NETWORK PROPOSAL ================= -->(.*?)<!-- ================= COMPARE ================= -->', self.html, re.DOTALL)
        self.assertIsNotNone(network_section)
        cards = re.findall(r'<div class="tier(?: featured)?" data-tier="(silver|gold|platinum)"[^>]*>', network_section.group(1))
        self.assertEqual(["silver", "gold", "platinum"], cards)
        for tier in cards:
            band = re.search(r'<div class="tier-band band-%s"([^>]*)>' % tier, network_section.group(1))
            self.assertIsNotNone(band, tier)
            self.assertNotIn("style=", band.group(1), tier)
        self.assertIn(".band-silver", self.html)
        self.assertIn(".band-gold", self.html)
        self.assertIn(".band-platinum", self.html)

    def test_network_proposal_copy_has_no_repeated_inline_band_styles(self):
        network_section = re.search(r'<!-- ================= NETWORK PROPOSAL ================= -->(.*?)<!-- ================= COMPARE ================= -->', self.html, re.DOTALL)
        self.assertIsNotNone(network_section)
        self.assertEqual(0, network_section.group(1).count("linear-gradient("))

    def test_gateway_lan_speeds_match_the_listed_gateways(self):
        network_section = re.search(r'<!-- ================= NETWORK PROPOSAL ================= -->(.*?)<!-- ================= COMPARE ================= -->', self.html, re.DOTALL)
        self.assertIsNotNone(network_section)
        expected = {
            "silver": ("UDR", "1 GbE LAN", "1 Gbps"),
            "gold": ("Cloud Gateway Ultra", "1 GbE", "1 Gbps"),
            "platinum": ("Cloud Gateway Max", "2.5 GbE", "2.3 Gbps"),
        }
        for tier, (gateway, speed, ips_throughput) in expected.items():
            card = tier_block(network_section.group(1), tier)
            self.assertIn(gateway, card, tier)
            self.assertRegex(card, r'<li><span class="k">Gateway LAN</span><span class="v">%s</span></li>' % re.escape(speed), tier)
            self.assertRegex(card, r'<li><span class="k">IDS/IPS throughput</span><span class="v">%s</span></li>' % re.escape(ips_throughput), tier)

    def test_platinum_network_rows_keep_wifi_before_ids_ips(self):
        network_section = re.search(r'<!-- ================= NETWORK PROPOSAL ================= -->(.*?)<!-- ================= COMPARE ================= -->', self.html, re.DOTALL)
        self.assertIsNotNone(network_section)
        for tier in ("silver", "gold", "platinum"):
            card = tier_block(network_section.group(1), tier)
            row_order = re.findall(r'<span class="k">(Wi‑Fi|IDS/IPS throughput)</span>', card)
            self.assertEqual(["Wi‑Fi", "IDS/IPS throughput"], row_order, tier)

    def test_network_switches_match_design_center_bill_of_materials(self):
        network_section = re.search(r'<!-- ================= NETWORK PROPOSAL ================= -->(.*?)<!-- ================= COMPARE ================= -->', self.html, re.DOTALL)
        self.assertIsNotNone(network_section)
        expected_switches = {
            "silver": ("USW-Ultra-60W",),
            "gold": ("USW-Flex-2.5G-8-PoE",),
            "platinum": ("USW-Ultra", "USW-Flex-2.5G-8-PoE"),
        }
        for tier, switch_ids in expected_switches.items():
            card = tier_block(network_section.group(1), tier)
            for switch_id in switch_ids:
                self.assertIn(switch_id, card, tier)

    def test_platinum_storage_claim_respects_gateway_max_limit(self):
        network_section = re.search(r'<!-- ================= NETWORK PROPOSAL ================= -->(.*?)<!-- ================= COMPARE ================= -->', self.html, re.DOTALL)
        self.assertIsNotNone(network_section)
        platinum = tier_block(network_section.group(1), "platinum")
        self.assertIn("UCG-Max-2TB", platinum)
        self.assertIn("2 TB model", platinum)
        self.assertNotIn("up to 2 TB local recording", platinum)

    def test_back_to_top_button_is_hidden_until_scrolled_down(self):
        button = re.search(r'<button[^>]*id="backToTop"[^>]*>', self.html)
        self.assertIsNotNone(button)
        if button is not None:
            self.assertRegex(button.group(0), r'\shidden(?:\s|>)')
        self.assertRegex(self.html, r'\.back-to-top\[hidden\]\s*\{\s*display:\s*none')
        self.assertIn('window.addEventListener(\'scroll\', updateBackToTop', self.html)
        self.assertIn('backToTop.hidden = window.scrollY <= 200;', self.html)
        self.assertIn('updateBackToTop();', self.html)

    def test_back_to_top_button_is_fixed_and_scrolls_to_page_top(self):
        self.assertRegex(self.html, r'<button[^>]+id="backToTop"[^>]*aria-label="Back to top"')
        self.assertRegex(self.html, r'\.back-to-top\s*\{[^}]*position:\s*fixed')
        self.assertIn("backToTop.addEventListener('click'", self.html)
        self.assertIn("window.scrollTo({ top: 0, behavior: 'auto' })", self.html)

    def test_network_anchor_links_scroll_smoothly_and_respect_reduced_motion(self):
        self.assertRegex(self.html, r'html\s*\{[^}]*scroll-behavior:\s*smooth')
        self.assertRegex(
            self.html,
            r'@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^}]*html\s*\{[^}]*scroll-behavior:\s*auto',
        )

    def test_network_tiers_are_separately_quoted_in_comparison(self):
        row = re.search(r'<td>Home network</td>(.*?)</tr>', self.html, re.DOTALL)
        self.assertIsNotNone(row)
        self.assertNotIn('class="status-mark included"', row.group(1))
        expected = {
            "Silver": "$1,825",
            "Gold": "$2,630",
            "Platinum": "$4,805",
        }
        for tier, price in expected.items():
            cell = re.search(r'<td data-label="%s">(.*?)</td>' % tier, row.group(1), re.DOTALL)
            self.assertIsNotNone(cell, tier)
            anchor_id = "network-" + tier.lower()
            self.assertRegex(self.html, r'<div[^>]+id="%s"' % anchor_id)
            link = re.search(r'<a[^>]+href="#%s"[^>]*>(.*?)</a>' % anchor_id, cell.group(1), re.DOTALL)
            self.assertIsNotNone(link, tier)
            self.assertIn(tier + " Network — " + price + " indicative hardware", link.group(1), tier)
            self.assertNotIn("Matching network tier available — quoted separately", cell.group(1), tier)

    def test_network_app_and_subscription_copy_are_scoped_correctly(self):
        network_section = re.search(r'<!-- ================= NETWORK PROPOSAL ================= -->(.*?)<!-- ================= COMPARE ================= -->', self.html, re.DOTALL)
        self.assertIsNotNone(network_section)
        self.assertEqual(3, network_section.group(1).count('class="k">Network management</span>'))
        self.assertEqual(3, network_section.group(1).count('class="v">UniFi app</span>'))
        self.assertNotIn('class="k">Remote access</span><span class="v">UniFi app', network_section.group(1))
        platinum = tier_block(network_section.group(1), "platinum")
        self.assertIn("no ongoing UniFi subscription fee", platinum)
        self.assertNotIn("No monthly fees", network_section.group(1))  # Nabu Casa remote access has a separate subscription.

    def test_tier_row_equaliser_recalculates_both_card_groups(self):
        script = self.html.split("<script>", 1)[1].split("</script>", 1)[0]
        self.assertIn("function equalizeTierRows()", script)
        self.assertIn(".page > .tiers, .network-proposal > .tiers", script)
        self.assertIn(".specs li", script)
        self.assertIn("querySelector('.tier-band')", script)
        self.assertIn("window.addEventListener('resize'", script)

    def test_network_tier_taglines_use_plain_parallel_benefits(self):
        network_section = re.search(r'<!-- ================= NETWORK PROPOSAL ================= -->(.*?)<!-- ================= COMPARE ================= -->', self.html, re.DOTALL)
        self.assertIsNotNone(network_section)
        expected = {
            "silver": "Designed for reliable whole-home coverage, with one access point per floor.",
            "gold": "Dense Wi‑Fi 7, with more access points for denser coverage throughout the home.",
            "platinum": "Local recording, with no ongoing UniFi subscription fee.",
        }
        for tier, tagline in expected.items():
            card = tier_block(network_section.group(1), tier)
            self.assertIn('<p class="tag tier-tag">%s</p>' % tagline, card, tier)
        self.assertNotIn("The sweet spot", network_section.group(1))
        self.assertNotIn("Everything —", network_section.group(1))

    def test_comparison_wall_displays_explain_sizes_and_platinum_android(self):
        row = re.search(r'<td>Wall screens</td>(.*?)</tr>', self.html, re.DOTALL)
        self.assertIsNotNone(row)
        expected = {
            "Silver": "2×S (small), 1×M (medium), 1×L (large)",
            "Gold": "2×S, 2×L",
            "Platinum": "2×S, 1×L High Performance (Android), 1×XL High Performance (Android)",
        }
        for tier, description in expected.items():
            cell = re.search(r'<td data-label="%s">([^<]+)</td>' % tier, row.group(1))
            self.assertIsNotNone(cell, tier)
            self.assertEqual(description, cell.group(1), tier)

    def test_comparison_table_matches_tier_wall_display_counts(self):
        row = re.search(r'<td>Wall screens</td>(.*?)</tr>', self.html, re.DOTALL)
        self.assertIsNotNone(row)
        expected = {
            "Silver": "2×S (small), 1×M (medium), 1×L (large)",
            "Gold": "2×S, 2×L",
            "Platinum": "2×S, 1×L High Performance (Android), 1×XL High Performance (Android)",
        }
        for tier, description in expected.items():
            cell = re.search(r'<td data-label="%s">([^<]+)</td>' % tier, row.group(1))
            self.assertIsNotNone(cell, tier)
            self.assertEqual(description, cell.group(1), tier)

    def test_automation_allowance_and_capacity_are_separate(self):
        expected = {
            "silver": ("5", "Up to 20"),
            "gold": ("10", "Up to 20"),
            "platinum": ("50", "Unlimited"),
        }
        for tier, (included, capacity) in expected.items():
            card = tier_block(self.html, tier)
            included_row = re.search(r'<li><span class="k">Automations included</span><span class="v">([^<]+)</span></li>', card)
            capacity_row = re.search(r'<li><span class="k">Automation capacity</span><span class="v">([^<]+)</span></li>', card)
            self.assertIsNotNone(included_row, tier)
            self.assertIsNotNone(capacity_row, tier)
            self.assertEqual(included, included_row.group(1), tier)
            self.assertEqual(capacity, capacity_row.group(1), tier)

    def test_presence_sensing_is_optional_for_gold_and_platinum(self):
        for tier in ("gold", "platinum"):
            card = tier_block(self.html, tier)
            row = re.search(r'<li><span class="k">Presence sensing</span><span class="v">([^<]+)</span></li>', card)
            self.assertIsNotNone(row, tier)
            self.assertEqual("Optional extra", row.group(1))
        comparison = re.search(r'<td>Presence sensing</td>(.*?)</tr>', self.html, re.DOTALL)
        self.assertIsNotNone(comparison)
        self.assertEqual(2, comparison.group(1).count("Optional extra"))

    def test_platinum_support_has_priority_and_callout_fee_exemption(self):
        platinum = tier_block(self.html, "platinum")
        self.assertIn("2 months, priority support, callout fee exempt", platinum)
        table = re.search(r"<td>Support after handover</td>(.*?)</tr>", self.html, re.DOTALL)
        self.assertIsNotNone(table)
        self.assertIn("2 months, priority support, callout fee exempt", table.group(1))
        self.assertNotIn("annual check", platinum)
        self.assertNotIn("annual check", table.group(1))

    def test_network_configuration_is_excluded_from_proposal(self):
        self.assertNotIn("Network configuration", self.html)
        self.assertNotIn("Wi-Fi 6", self.html)
        self.assertNotIn("Wi-Fi 7", self.html)

    def test_delivery_step_two_is_consultation_about_package_and_addons(self):
        self.assertRegex(
            self.html,
            r'<div class="step">\s*<div class="n">2</div>\s*<div class="t">Consultation</div>'
            r'\s*<div class="d">[^<]*detailed plan[^<]*package[^<]*add-ons[^<]*</div>\s*</div>',
        )
        self.assertNotIn('class="t">Pilot</div>', self.html)

    def test_silver_wall_screen_is_included_in_card(self):
        silver = tier_block(self.html, "silver")
        self.assertRegex(
            silver,
            r'<li><span class="k">Wall screens</span><span class="v">[^<]+</span></li>',
        )
        self.assertNotRegex(silver, r'Wall screens</span><span class="v none"')

    def test_comparison_shows_silver_wall_screen_quantity(self):
        row = re.search(r'<tr class="hl">\s*<td>Wall screens</td>(.*?)</tr>', self.html, re.DOTALL)
        self.assertIsNotNone(row)
        silver_cell = re.search(r'<td data-label="Silver">(.*?)</td>', row.group(1), re.DOTALL)
        self.assertIsNotNone(silver_cell)
        self.assertEqual("2×S (small), 1×M (medium), 1×L (large)", silver_cell.group(1))

    def test_diagram_shows_garage_and_air_conditioning_across_tiers(self):
        diagram = re.search(r'<div class="diagram">([\s\S]*?)</div>\s*</div>\s*</div>', self.html)
        self.assertIsNotNone(diagram)
        self.assertIn("Garage door and air conditioning on all tiers", re.sub(r"<[^>]+>", "", diagram.group(1)))
        self.assertNotIn("air conditioning from Gold", diagram.group(1))

    def test_footer_does_not_contradict_tier_network_table(self):
        footer = re.search(r"<footer>([\s\S]*?)</footer>", self.html)
        self.assertIsNotNone(footer)
        self.assertNotIn("Network configurations are listed by tier above.", footer.group(1))
        self.assertNotIn("The new network is included in the Gold and Platinum prices.", footer.group(1))

    def test_comparison_tick_dash_markers_preserved(self):
        self.assertIn(".status-mark.included", self.html)
        self.assertIn(".status-mark.excluded", self.html)
        self.assertNotIn('class="dot', self.html)
        self.assertEqual(7, self.html.count('class="status-mark included"'))
        self.assertEqual(3, self.html.count('class="status-mark excluded"'))


if __name__ == "__main__":
    unittest.main(verbosity=2)
