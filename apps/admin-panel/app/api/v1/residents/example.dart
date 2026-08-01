// Automatic FlutterFlow imports
import '/backend/schema/structs/index.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/actions/actions.dart' as action_blocks;
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/custom_code/actions/index.dart'; // Imports other custom actions
import '/flutter_flow/custom_functions.dart'; // Imports custom functions
import 'package:flutter/material.dart';
// Begin custom action code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

import 'package:onesignal_flutter/onesignal_flutter.dart';

Future onesignal(String supabaseUID) async {
  OneSignal.Debug.setLogLevel(OSLogLevel.verbose);
  OneSignal.initialize("84ebf9ec-0ab7-4607-ad72-b5a1687d7517");
  OneSignal.Notifications.requestPermission(true);
  await OneSignal.login(supabaseUID);

  // Obtener datos del usuario desde Supabase
  final response = await Supabase.instance.client
      .from('users')
      .select('rol')
      .eq('id', supabaseUID)
      .single();

  final rol = response['rol'];

  // Agregar tag del rol
  await OneSignal.User.addTagWithKey('rol', rol);

  if (rol == 'residente') {
    // Obtener el admin_id del conjunto al que pertenece el residente
    final adminQuery = await Supabase.instance.client
        .from('residentes')
        .select('conjuntos (user_id)')
        .eq('user_id', supabaseUID)
        .single();

    final adminID = adminQuery['conjuntos']['user_id'];

    // Agregar tag admin_id
    await OneSignal.User.addTagWithKey('admin_id', adminID);
  }
}

// Set your action name, define your arguments and return parameter,
// and then add the boilerplate code using the green button on the right!
