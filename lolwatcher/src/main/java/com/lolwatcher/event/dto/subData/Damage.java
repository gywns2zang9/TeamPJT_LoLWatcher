package com.lolwatcher.event.dto.subData;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class Damage {
    boolean basic;
    int magicDamage;
    String name;
    int participantId;
    int physicalDamage;
    String spellName;
    int spellSlot;
    int trueDamage;
    String type;
}
