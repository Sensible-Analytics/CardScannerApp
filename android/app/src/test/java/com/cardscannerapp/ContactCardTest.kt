package com.cardscannerapp

import com.cardscannerapp.domain.model.ContactCard
import org.junit.Assert.*
import org.junit.Test

class ContactCardTest {

    @Test
    fun emptyCard_hasNoDetails() {
        val card = ContactCard.empty()
        assertFalse(card.hasDetails())
    }

    @Test
    fun cardWithName_hasDetails() {
        val card = ContactCard(name = "John Doe")
        assertTrue(card.hasDetails())
    }

    @Test
    fun cardWithEmail_hasDetails() {
        val card = ContactCard(email = "john@example.com")
        assertTrue(card.hasDetails())
    }

    @Test
    fun cardWithPhone_hasDetails() {
        val card = ContactCard(phone = "555-1234")
        assertTrue(card.hasDetails())
    }

    @Test
    fun cardWithCompany_hasDetails() {
        val card = ContactCard(company = "Acme Inc")
        assertTrue(card.hasDetails())
    }
}
