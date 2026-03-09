/**
 * Mapping from world-atlas country names to our ISO 2-letter codes
 * This handles cases where the names don't match exactly
 */
export const worldAtlasToIso: { [key: string]: string } = {
  // Greenland and Antarctica
  'greenland': 'GL',
  'antarctica': 'AQ',
  
  // United States variations
  'united states of america': 'US',
  'united states': 'US',
  'usa': 'US',
  
  // Abbreviated/shortened names from world-atlas
  'bangladesh': 'BD',
  'bosnia and herz.': 'BA',
  'central african rep.': 'CF',
  'czechia': 'CZ',
  'côte d\'ivoire': 'CI',
  'dem. rep. congo': 'CD',
  'dominican rep.': 'DO',
  'eq. guinea': 'GQ',
  'eswatini': 'SZ',
  'falkland is.': 'FK',
  'fr. s. antarctic lands': 'TF',
  'jamaica': 'JM',
  'kosovo': 'XK',
  'macedonia': 'MK',
  'north macedonia': 'MK',
  'n. cyprus': 'CY',
  'new caledonia': 'NC',
  'palestine': 'PS',
  'puerto rico': 'PR',
  's. sudan': 'SS',
  'south sudan': 'SS',
  'solomon is.': 'SB',
  'solomon islands': 'SB',
  'somaliland': 'SO',
  'w. sahara': 'EH',
  'western sahara': 'EH',
  
  // Other common variations
  'united kingdom': 'GB',
  'united kingdom of great britain and northern ireland': 'GB',
  'republic of korea': 'KR',
  'korea': 'KR',
  'northern ireland': 'GB',
  'netherlands (former)': 'NL',
  'yugoslavia (former)': 'RS',
  'soviet union (former)': 'RU',
  'czechoslovakia (former)': 'CZ',
  'serbia and montenegro': 'RS',
  'belgian congo (former)': 'CD',
  'northern rhodesia (former)': 'ZM',
  'southern rhodesia (former)': 'ZW',
  'german dem. rep. (former)': 'DE',
  'french guiana': 'GF',
  'french polynesia': 'PF',
  'isle of man': 'IM',
  'st. helena': 'SH',
  'timor-leste': 'TL',
  'east timor': 'TL',
  'turks and caicos islands': 'TC',
  'virgin islands': 'VG',
  'cook islands': 'CK',
  'niue': 'NU',
  'wallis and futuna': 'WF',
  'tokelau': 'TK',
  'st. lucia': 'LC',
  'st. vincent and the grenadines': 'VC',
  'st. kitts and nevis': 'KN',
  'sao tome and principe': 'ST',
  'antigua and barbuda': 'AG',
  'trinidad and tobago': 'TT',
  'dominica': 'DM',
  'mauritius': 'MU',
  'seychelles': 'SC',
  'comoros': 'KM',
  'papua new guinea': 'PG',
  'democratic republic of the congo': 'CD',
  'congo': 'CG',
  'ivory coast': 'CI',
  'reunion': 'RE',
  'curacao': 'CW',
  'sint maarten': 'SX',
  'st. martin': 'MF',
  'bonaire, st. eustatius and saba': 'BQ',
  'bahamas': 'BS',
  'bahamas, the': 'BS',
  'gambia': 'GM',
  'gambia, the': 'GM',
  'montenegro': 'ME',
  'taiwan': 'TW',
  'china': 'CN',
  'macau': 'MO',
  'hong kong': 'HK',
  'guernsey': 'GG',
  'jersey': 'JE',
  'aland islands': 'AX',
  'faroe islands': 'FO',
  'svalbard and jan mayen': 'SJ',
};

/**
 * Get ISO code from various country name formats
 */
export function getIsoCode(countryName: string): string | undefined {
  if (!countryName) return undefined;
  
  const normalized = countryName.toLowerCase().trim();
  
  // Check direct mapping only — no fuzzy/substring matching to avoid false positives
  // (e.g. "ireland" must NOT match "northern ireland", "sudan" must NOT match "south sudan")
  return worldAtlasToIso[normalized];
}
