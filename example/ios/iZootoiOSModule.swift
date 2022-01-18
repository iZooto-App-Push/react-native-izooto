//
//  iZootoiOSModule.swift
//  example
//
//  Created by Amit on 18/01/22.
//

import Foundation
import UIKit

@objc(iZootoiOSModule)
class iZootoiOSModule : NSObject
{
  @objc static func requiresMainQueueSetup() -> Bool {return true}
  @objc func iZootoinitalise(izootoapp_id: NSString)
  {
    print(izootoapp_id)
  }
}
