package com.cardscannerapp.ui.screens.editcontact

import android.content.Intent
import android.provider.ContactsContract
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.cardscannerapp.data.db.ContactDatabase
import com.cardscannerapp.data.repository.ContactRepository
import com.cardscannerapp.domain.model.ContactCard
import com.cardscannerapp.util.ContactManager
import com.cardscannerapp.util.ShareHelper

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditContactScreen(
    contactId: String,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val viewModel = remember {
        EditContactViewModel(
            ContactRepository(ContactDatabase.getInstance(context).contactDao())
        )
    }
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(contactId) {
        viewModel.loadContact(contactId)
    }

    if (uiState.isLoading) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        return
    }

    val contact = uiState.contact ?: run {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text(uiState.errorMessage ?: "Contact not found")
        }
        return
    }

    var name by remember(contact.name) { mutableStateOf(contact.name) }
    var firstName by remember(contact.firstName) { mutableStateOf(contact.firstName) }
    var lastName by remember(contact.lastName) { mutableStateOf(contact.lastName) }
    var title by remember(contact.title) { mutableStateOf(contact.title) }
    var company by remember(contact.company) { mutableStateOf(contact.company) }
    var email by remember(contact.email) { mutableStateOf(contact.email) }
    var phone by remember(contact.phone) { mutableStateOf(contact.phone) }
    var address by remember(contact.address) { mutableStateOf(contact.address) }
    var website by remember(contact.website) { mutableStateOf(contact.website) }

    val updatedContact = contact.copy(
        name = name, firstName = firstName, lastName = lastName,
        title = title, company = company, email = email, phone = phone,
        address = address, website = website
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit Contact") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState()).padding(16.dp)
        ) {
            contact.imageUri?.let { uri ->
                AsyncImage(
                    model = uri,
                    contentDescription = "Original scan",
                    modifier = Modifier.fillMaxWidth().height(200.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            OutlinedTextField(
                value = name, onValueChange = { name = it },
                label = { Text("Name") }, modifier = Modifier.fillMaxWidth(),
                
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = email, onValueChange = { email = it },
                label = { Text("Email") }, modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = phone, onValueChange = { phone = it },
                label = { Text("Phone") }, modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = company, onValueChange = { company = it },
                label = { Text("Company") }, modifier = Modifier.fillMaxWidth(),
                
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = address, onValueChange = { address = it },
                label = { Text("Address") }, modifier = Modifier.fillMaxWidth(),
                
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = website, onValueChange = { website = it },
                label = { Text("Website") }, modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Uri),
                
            )

            Spacer(modifier = Modifier.height(24.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = {
                        viewModel.saveContact(updatedContact)
                        onNavigateBack()
                    },
                    modifier = Modifier.weight(1f),
                    
                ) {
                    Icon(Icons.Default.Save, contentDescription = null)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Save")
                }
                OutlinedButton(
                    onClick = {
                        ContactManager.openContactForm(context, updatedContact)
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.PersonAdd, contentDescription = null)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Add to Contacts")
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = {
                        ShareHelper.shareVCard(context, updatedContact)
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Share, contentDescription = null)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Share vCard")
                }
                Button(
                    onClick = {
                        viewModel.deleteContact(updatedContact)
                        onNavigateBack()
                    },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Red),
                    
                ) {
                    Icon(Icons.Default.Delete, contentDescription = null)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Delete")
                }
            }

            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}
