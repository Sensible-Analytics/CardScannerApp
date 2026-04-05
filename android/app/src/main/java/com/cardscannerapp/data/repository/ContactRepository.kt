package com.cardscannerapp.data.repository

import com.cardscannerapp.data.db.ContactDao
import com.cardscannerapp.data.db.toDomain
import com.cardscannerapp.data.db.toEntity
import com.cardscannerapp.domain.model.ContactCard
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class ContactRepository(private val contactDao: ContactDao) {

    fun getAllContacts(): Flow<List<ContactCard>> {
        return contactDao.getAllContacts().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    suspend fun getContactById(id: String): ContactCard? {
        return contactDao.getContactById(id)?.toDomain()
    }

    suspend fun insertContact(contact: ContactCard) {
        contactDao.insertContact(contact.toEntity())
    }

    suspend fun updateContact(contact: ContactCard) {
        contactDao.updateContact(contact.toEntity())
    }

    suspend fun deleteContact(contact: ContactCard) {
        contactDao.deleteContact(contact.toEntity())
    }

    suspend fun deleteAllContacts() {
        contactDao.deleteAllContacts()
    }
}
