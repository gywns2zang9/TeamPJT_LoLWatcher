package com.lolwatcher.event.dto;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class MatchPerks {
    private StatPerks statPerks;
    private List<PerkStyle> styles;
}

@AllArgsConstructor
class StatPerks {
    private int defense;
    private int flex;
    private int offense;
}

@AllArgsConstructor
class PerkStyle {
    private String description;
    private List<PerkSelection> selections;
}

@AllArgsConstructor
class PerkSelection {
    private int perk;
    private int var1;
    private int var2;
    private int var3;
}
