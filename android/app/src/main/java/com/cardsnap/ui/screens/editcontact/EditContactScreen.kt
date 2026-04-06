package com.cardsnap.ui.screens.editcontact

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.cardsnap.data.db.ContactDatabase
import com.cardsnap.data.repository.ContactRepository
import com.cardsnap.util.ContactManager
import com.cardsnap.util.ShareHelper

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditContactScreen(contactId: String, onNavigateBack: () -> Unit) {
    val context = LocalContext.current
    val viewModel = remember { EditContactViewModel(ContactRepository(ContactDatabase.getInstance(context).contactDao())) }
    val uiState by viewModel.uiState.collectAsState()
    LaunchedEffect(contactId) { viewModel.loadContact(contactId) }
    if (uiState.isLoading) { Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }; return }
    val contact = uiState.contact ?: run { Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text(uiState.errorMessage ?: "Contact not found") }; return }
    var name by remember { mutableStateOf(contact.name ?: "") }
    var email by remember { mutableStateOf(contact.email ?: "") }
    var phone by remember { mutableStateOf(contact.phone ?: "") }
    var company by remember { mutableStateOf(contact.company ?: "") }
    var address by remember { mutableStateOf(contact.address ?: "") }
    var website by remember { mutableStateOf(contact.website ?: "") }
    val updatedContact = contact.copy(name = name, email = email, phone = phone, company = company, address = address, website = website)
    Scaffold(topBar = {
        TopAppBar(title = { Text("Edit Contact") },
            navigationIcon = { IconButton(onClick = onNavigateBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } })
    }) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState()).padding(16.dp)) {
            contact.imageUri?.let { uri -> AsyncImage(model = uri, contentDescription = "Original scan", modifier = Modifier.fillMaxWidth().height(200.dp)); Spacer(modifier = Modifier.height(16.dp)) }
            OutlinedTextField(value = name, onValueChange = { value -> name = value }, label = { Text("Name") }, modifier = Modifier.fillMaxWidth().testTag("name-input"), keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text))
Spacer(modifier = Modifier.height(8.dp))
OutlinedTextField(value = email, onValueChange = { value -> email = value }, label = { Text("Email") }, modifier = Modifier.fillMaxWidth().testTag("email-input"), keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email))
Spacer(modifier = Modifier.height(8.dp))
OutlinedTextField(value = phone, onValueChange = { value -> phone = value }, label = { Text("Phone") }, modifier = Modifier.fillMaxWidth().testTag("phone-input"), keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone))
Spacer(modifier = Modifier.height(8.dp))
OutlinedTextField(value = company, onValueChange = { value -> company = value }, label = { Text("Company") }, modifier = Modifier.fillMaxWidth().testTag("company-input"), keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text))
Spacer(modifier = Modifier.height(8.dp))
OutlinedTextField(value = address, onValueChange = { value -> address = value }, label = { Text("Address") }, modifier = Modifier.fillMaxWidth().testTag("address-input"), keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text))
Spacer(modifier = Modifier.height(8.dp))
OutlinedTextField(value = website, onValueChange = { value -> website = value }, label = { Text("Website") }, modifier = Modifier.fillMaxWidth().testTag("website-input"), keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Uri))
Spacer(modifier = Modifier.height(8.dp))
            Spacer(modifier = Modifier.height(24.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Button(onClick = { viewModel.saveContact(updatedContact); onNavigateBack() }, modifier = Modifier.weight(1f).testTag("save-button")) { Icon(Icons.Default.Save, contentDescription = null); Spacer(modifier = Modifier.width(4.dp)); Text("Save") }
                OutlinedButton(onClick = { ContactManager.openContactForm(context, updatedContact) }, modifier = Modifier.weight(1f)) { Icon(Icons.Default.PersonAdd, contentDescription = null); Spacer(modifier = Modifier.width(4.dp)); Text("Add to Contacts") }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedButton(onClick = { ShareHelper.shareVCard(context, updatedContact) }, modifier = Modifier.weight(1f)) { Icon(Icons.Default.Share, contentDescription = null); Spacer(modifier = Modifier.width(4.dp)); Text("Share vCard") }
                Button(onClick = { viewModel.deleteContact(updatedContact); onNavigateBack() }, modifier = Modifier.weight(1f).testTag("delete-button"), colors = ButtonDefaults.buttonColors(containerColor = Color.Red)) { Icon(Icons.Default.Delete, contentDescription = null); Spacer(modifier = Modifier.width(4.dp)); Text("Delete") }
            }
            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}
